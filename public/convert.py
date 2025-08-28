import json

def convert_to_correct_json(input_file, output_file):
    data = []
    headers = []
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    # Busca la línea con los nombres de las columnas
    for i, line in enumerate(lines):
        if line.strip().startswith('pl_name,hostname'):
            # Los nombres de las columnas están en esta línea
            headers = [h.strip() for h in line.strip().split(',')]
            # Los datos comienzan en la siguiente línea
            data_start_index = i + 1
            break
            
    if not headers:
        print("Error: No se encontraron los encabezados de las columnas en el archivo.")
        return
        
    # Procesa cada línea de datos
    for line in lines[data_start_index:]:
        # Ignora las líneas vacías o de comentarios
        if not line.strip() or line.strip().startswith('#'):
            continue
            
        # Divide la línea por comas para obtener los valores
        values = [v.strip() for v in line.strip().split(',')]
        
        # Crea un diccionario para cada fila y lo agrega a la lista de datos
        row_dict = dict(zip(headers, values))
        data.append(row_dict)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    
    print(f"Conversión exitosa. Archivo '{output_file}' creado.")

if __name__ == "__main__":
    # Usa el nombre del archivo CSV que descargaste
    convert_to_correct_json('exoplanet-data.csv', 'exoplanet-data.json')
