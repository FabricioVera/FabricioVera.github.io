import json
import unicodedata
from collections import Counter

# Lista de palabras clave que querés detectar
palabras_clave = ["recarga de escudo","radiación" ,"cadencia de fuego", "perforación", "cortante", "recibir daño", "fuerza de habilidad", "reduce la armadura", "acumulaciones"]


# Normalización de texto: minúsculas, sin acentos
def normalizar(texto):
    texto = texto.lower()
    texto = unicodedata.normalize('NFD', texto)
    return ''.join(c for c in texto if unicodedata.category(c) != 'Mn')

# Extraer tags de múltiples niveles
def extraer_tags_de_niveles(level_stats, claves):
    encontrados = set()
    for nivel in level_stats:
        for descripcion in nivel.get("stats", []):
            descripcion_normalizada = normalizar(descripcion)
            for clave in claves:
                if normalizar(clave) in descripcion_normalizada:
                    encontrados.add(clave)
    return list(encontrados)

# Cargar JSON
with open("/workspaces/FabricioVera.github.io/Modle/data/mods.json", "r", encoding="utf-8") as f:
    datos = json.load(f)

contador_tags = Counter()

# Procesar cada mod
for mod in datos:
    level_stats = mod.get("levelStats", [])
    tags = extraer_tags_de_niveles(level_stats, palabras_clave)
    mod["tags"] = tags
    contador_tags.update(tags)

# Guardar el resultado
with open("/workspaces/FabricioVera.github.io/Modle/data/mods_con_tags.json", "w", encoding="utf-8") as f:
    json.dump(datos, f, indent=2, ensure_ascii=False)

# Mostrar el conteo
print("Resumen de tags encontrados:")
for tag, cantidad in contador_tags.items():
    print(f"- {tag}: {cantidad}")
