import json

with open("Warframedle/data/warframes.json", "r", encoding="utf-8") as f:
    warframes = json.load(f)

for w in warframes:
    try:
        w["releaseYear"] = w["releaseDate"][:4]  # e.g., "2016"
    except KeyError:
        w["releaseYear"] = None

with open("warframes_updated.json", "w", encoding="utf-8") as f:
    json.dump(warframes, f, ensure_ascii=False, indent=2)
