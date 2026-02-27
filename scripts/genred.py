import os
import re
import json
import shutil
from pathlib import Path
from datetime import datetime
from slugify import slugify

import exifread
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] # assume scripts/ level down
ASSETS = ROOT/ "assets"
POSTS = ROOT/ "_posts"
RED = ROOT/ "red"
STAGE = ROOT/ "staging"
TEMPLATE_PATH = Path("scripts/_template")
IMG_RE = re.compile(r".*\.(jpe?g)$", re.IGNORECASE)

def pad2(n:int) -> str:
    return str(n).zfill(2)
def ymd(dt: datetime) -> str:
    return f"{dt.year}-{pad2(dt.month)}-{pad2(dt.day)}"
def yymmdd(dt: datetime) -> str:
    return f"{str(dt.year)[-2:]}{pad2(dt.month)}{pad2(dt.day)}"
def parse_exif_dt(tags: dict) -> datetime | None:
    # Try common EXIF fields for capture time
    for key in ("EXIF DateTimeOriginal", "EXIF DateTimeDigitized", "Image DateTime"):
        if key in tags:
            val = str(tags[key])
            # typical format: "2026:01:19 12:34:56"
            try:
                return datetime.strptime(val, "%Y:%m:%d %H:%M:%S")
            except ValueError:
                pass
    return None

def get_camera_model(tags: dict) -> str:
    make = str(tags.get("Image Make", "")).strip()
    model = str(tags.get("Image Model", "")).strip()

    # Optional extras if you want them:
    lens = str(tags.get("EXIF LensModel", "")).strip()

    # Build a nice string
    cam = " ".join([x for x in [make, model] if x])
    if not cam:
        return ""
    cam = cam.split()[-1]
    if lens: cam = f"{cam} | {lens}"
    return cam
def parse_gps(tags: dict) -> str:
    # Returns "lat, lon" or "" if not available
    try:
        lat_tag = tags.get("GPS GPSLatitude")
        lat_ref = str(tags.get("GPS GPSLatitudeRef", "")).strip()
        lon_tag = tags.get("GPS GPSLongitude")
        lon_ref = str(tags.get("GPS GPSLongitudeRef", "")).strip()

        if not (lat_tag and lon_tag and lat_ref and lon_ref):
            return ""

        lat = dms_to_decimal(lat_tag.values, lat_ref)
        lon = dms_to_decimal(lon_tag.values, lon_ref)
        return f"{lat}x{lon}"
    except Exception:
        return "00000,00000"
def image_dimensions(path: Path) -> tuple[int,int] | tuple[None,None]:
    try:
        with Image.open(path) as im:
            return im.size[0],im.size[1]
    except Exception:
        return None, None
def build_md(title: str, section: str, web_path: str,top_left: str,top_right: str, bottom_left: str, bottom_right: str) -> str:
    lines = [
            "---",
            "layout: post",
            f"title: {title}",
            f"section: {section}",
            f"image: {web_path}",
            f'top_left: "{top_left}"',
            f'top_right: "{top_right}"',
            f'bottom_left: "{bottom_left}"',
            f'bottom_right: "{bottom_right}"',
            "---",
            "",
        ]
    return "\n".join(lines)
def build_red_dirs(section: str):
    section_indx = Path("red") / section
    section_ast = Path(ASSETS) / section
    section_ast.mkdir(exist_ok=True)
    section_indx.mkdir(exist_ok=True)
    index_file = section_indx / "index.html"
    temp = TEMPLATE_PATH.read_text()
    output = temp.replace("{*???*}",section)
    index_file.write_text(output)
    print(f"created {index_file}")


def main(section: str, force: bool=False, dry: bool = False, verbose: bool = False):
    
    build_red_dirs(section)
    if not ASSETS.exists():
        raise SystemExit(f"missing asset directory")
    section_dir = Path(ASSETS/section)
    for item in STAGE.iterdir():
        shutil.move(str(item),section_dir/item.name)
    images = sorted([p for p in section_dir.iterdir() if p.is_file() and IMG_RE.match(p.name)])
    if not images:
        print("nothing to be found here my friend")
        return
    i = 0
    for img_path in images:
        base = img_path.stem 
        title = base
        tags = {}
        try:
            with img_path.open("rb") as f:
                tags = exifread.process_file(f, details=False)
        except Exception:
            tags={}

        dt = parse_exif_dt(tags)
        if dt is None:
            # ddefault to timestamp
            dt = datetime.fromtimestamp(img_path.stat().st_mtime)
        w, h = image_dimensions(img_path)
        dims = f"{w}x{h}" if w and h else "AxB"
        coords = parse_gps(tags)
        model = get_camera_model(tags)
        date_str = ymd(dt)
        date_fmt = yymmdd(dt)
        slug = slugify(title)
        md_name = f"{date_str}-{slug}.md"
        md_path = POSTS / md_name

        md_text = build_md(
                title=title,
                section=section,
                web_path=f"/assets/{section}/{img_path.name}",
                top_left=f"{date_fmt}_{i}",
                top_right=title,
                bottom_left=model,
                bottom_right=dims,
                )
        if md_path.exists() and not force:
            if verbose:
                print(f"skip (exists): {md_path.relative_to(ROOT)}  (use --force)")
            continue

        if dry:
            print(f"--- {md_name} ---\n{md_text}")
        else:
            md_path.write_text(md_text, encoding="utf-8")
            print(f"wrote: {md_path.relative_to(ROOT)}")
        i = i+1

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="generate Jekyll posts from /assets images")
    parser.add_argument("--section", required=True, help="one, two, red, blue or photo directory")
    parser.add_argument("--force", action="store_true", help="overwrite existing .md files")
    parser.add_argument("--dry", action="store_true", help="print output but do not write files")
    parser.add_argument("--verbose", action="store_true", help="print skip info")
    args = parser.parse_args()

    main(args.section, force=args.force, dry=args.dry, verbose=args.verbose)
