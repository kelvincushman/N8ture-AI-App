from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mock database for species information
SPECIES_DATABASE = {
    'birds': {
        'Turdus migratorius': {
            'common_name': 'American Robin',
            'description': 'A common North American bird with a distinctive red breast and melodious song.',
            'edibility': 'Not applicable',
            'herbal_benefits': 'Not applicable',
            'habitat': 'Gardens, parks, woodlands',
            'conservation_status': 'Least Concern'
        },
        'Corvus brachyrhynchos': {
            'common_name': 'American Crow',
            'description': 'A large, intelligent black bird known for its problem-solving abilities.',
            'edibility': 'Not applicable',
            'herbal_benefits': 'Not applicable',
            'habitat': 'Urban areas, farmlands, forests',
            'conservation_status': 'Least Concern'
        },
        'Cardinalidae cardinalis': {
            'common_name': 'Northern Cardinal',
            'description': 'A vibrant red bird (males) with a distinctive crest and black face mask.',
            'edibility': 'Not applicable',
            'herbal_benefits': 'Not applicable',
            'habitat': 'Woodlands, gardens, shrublands',
            'conservation_status': 'Least Concern'
        }
    },
    'plants': {
        'Taraxacum officinale': {
            'common_name': 'Common Dandelion',
            'description': 'A widespread flowering plant with yellow flowers and deeply toothed leaves.',
            'edibility': 'Edible - leaves, flowers, and roots are all edible',
            'herbal_benefits': 'Rich in vitamins A, C, and K. Used traditionally for liver support and as a diuretic.',
            'habitat': 'Lawns, meadows, roadsides',
            'uses': 'Salads, teas, traditional medicine'
        },
        'Plantago major': {
            'common_name': 'Broadleaf Plantain',
            'description': 'A common weed with broad, ribbed leaves arranged in a rosette.',
            'edibility': 'Edible - young leaves can be eaten raw or cooked',
            'herbal_benefits': 'Anti-inflammatory properties, used for wound healing and respiratory issues.',
            'habitat': 'Lawns, paths, disturbed soils',
            'uses': 'Natural bandage, herbal tea, salads'
        },
        'Urtica dioica': {
            'common_name': 'Stinging Nettle',
            'description': 'A perennial plant with serrated leaves that cause a stinging sensation when touched.',
            'edibility': 'Edible when cooked - neutralizes the sting',
            'herbal_benefits': 'High in iron, vitamins, and minerals. Used for allergies and joint pain.',
            'habitat': 'Moist soils, woodlands, gardens',
            'uses': 'Herbal tea, cooked greens, traditional medicine'
        }
    },
    'fungi': {
        'Amanita muscaria': {
            'common_name': 'Fly Agaric',
            'description': 'A distinctive red mushroom with white spots. Highly toxic and psychoactive.',
            'edibility': 'Poisonous - contains toxic compounds',
            'herbal_benefits': 'None - toxic mushroom, historically used in shamanic practices',
            'habitat': 'Coniferous and deciduous forests',
            'warning': 'Extremely dangerous - can cause severe poisoning or death'
        },
        'Agaricus bisporus': {
            'common_name': 'Button Mushroom',
            'description': 'The common white mushroom found in grocery stores.',
            'edibility': 'Edible and widely cultivated',
            'herbal_benefits': 'Good source of protein, B vitamins, and selenium.',
            'habitat': 'Cultivated commercially, rarely found wild',
            'uses': 'Culinary mushroom, nutritional supplement'
        },
        'Amanita phalloides': {
            'common_name': 'Death Cap',
            'description': 'One of the most poisonous mushrooms in the world, responsible for most mushroom poisoning deaths.',
            'edibility': 'Extremely poisonous - often fatal',
            'herbal_benefits': 'None - deadly toxic',
            'habitat': 'Oak and other hardwood forests',
            'warning': 'Lethal - no safe amount for consumption'
        }
    }
}

@app.route('/api/identify', methods=['POST'])
def identify_species():
    """Mock AI identification endpoint"""
    try:
        # In a real app, this would process the uploaded image
        # For now, we'll return a random species from our database
        
        category = request.json.get('category', 'plants')
        if category not in SPECIES_DATABASE:
            category = 'plants'
        
        # Select a random species from the category
        species_list = list(SPECIES_DATABASE[category].keys())
        selected_species = random.choice(species_list)
        species_data = SPECIES_DATABASE[category][selected_species]
        
        # Generate a confidence score
        confidence = random.randint(85, 98)
        
        result = {
            'species': selected_species,
            'common_name': species_data['common_name'],
            'confidence': confidence,
            'category': category.rstrip('s').title(),  # Remove 's' and capitalize
            'description': species_data['description'],
            'edibility': species_data['edibility'],
            'herbal_benefits': species_data['herbal_benefits'],
            'habitat': species_data.get('habitat', 'Various habitats'),
            'warning': species_data.get('warning'),
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/species/<category>', methods=['GET'])
def get_species_by_category(category):
    """Get all species in a category"""
    if category not in SPECIES_DATABASE:
        return jsonify({'error': 'Category not found'}), 404
    
    species_list = []
    for species_name, data in SPECIES_DATABASE[category].items():
        species_list.append({
            'species': species_name,
            'common_name': data['common_name'],
            'description': data['description']
        })
    
    return jsonify({
        'category': category,
        'count': len(species_list),
        'species': species_list
    })

@app.route('/api/species/search', methods=['GET'])
def search_species():
    """Search for species by name"""
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify({'error': 'Query parameter required'}), 400
    
    results = []
    for category, species_dict in SPECIES_DATABASE.items():
        for species_name, data in species_dict.items():
            if (query in species_name.lower() or 
                query in data['common_name'].lower()):
                results.append({
                    'species': species_name,
                    'common_name': data['common_name'],
                    'category': category,
                    'description': data['description']
                })
    
    return jsonify({
        'query': query,
        'count': len(results),
        'results': results
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get database statistics"""
    stats = {}
    total_species = 0
    
    for category, species_dict in SPECIES_DATABASE.items():
        count = len(species_dict)
        stats[category] = count
        total_species += count
    
    return jsonify({
        'total_species': total_species,
        'categories': stats,
        'supported_categories': list(SPECIES_DATABASE.keys())
    })

if __name__ == '__main__':
    # Create backend directory if it doesn't exist
    os.makedirs('backend', exist_ok=True)
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
