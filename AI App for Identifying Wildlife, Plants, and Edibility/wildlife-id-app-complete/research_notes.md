# Wildlife and Plant Identification App Research

## Bird and Wildlife Datasets

### NABirds Dataset
- **Source**: Cornell Lab of Ornithology
- **Size**: 48,000 annotated photographs
- **Species**: 400 North American bird species
- **Categories**: 700+ visual categories (including male, female, juvenile variations)
- **Features**: More than 100 photographs per species, taxonomically organized
- **Use Case**: Fine-grained visual categorization experiments
- **Contact**: Grant Van Horn (gvanhorne@cornell.edu)
- **Collaboration**: Cornell Lab, Cornell Tech, Caltech, Brigham Young University
- **Access**: Requires registration form on website
- **URL**: https://dl.allaboutbirds.org/nabirds

### Other Bird Datasets Found:
- **LaSBiRD**: Large Scale Bird Recognition Dataset - 5 million images, 11,000 species
- **Visual WetlandBirds Dataset**: 178 videos, 13 species, behavior recognition
- **BirdRecon**: Open-source bird species recognition system
- **African Wildlife Dataset**: Buffalo and other South African animals
- **Animal Kingdom Dataset**: Multiple annotated tasks for animal understanding

## Plant and Fungi Datasets

### Key Findings Needed:
- PlantNet-300K dataset details
- Mushroom classification datasets
- Edible plant databases
- Fungi identification resources

## Next Steps:
1. Investigate PlantNet-300K dataset
2. Research mushroom classification datasets
3. Look into edible plant databases
4. Explore AI model architectures for image classification


### PlantNet-300K Dataset
- **Source**: Pl@ntNet citizen observatory
- **Size**: 306,146 plant images
- **Species**: 1,081 plant species
- **Features**: High class ambiguity, long-tailed distribution (80% of species account for only 11% of images)
- **Split**: Train (243,916), Val (31,118), Test (31,112)
- **License**: Available on Zenodo
- **Download**: 31.7 GB zip file
- **URL**: https://doi.org/10.5281/zenodo.5645731
- **Code**: PyTorch utilities available on GitHub

## Fungi/Mushroom Datasets

### UCI Mushroom Classification Dataset
- **Source**: UCI Machine Learning Repository
- **Size**: 8,124 samples
- **Species**: 23 species of gilled mushrooms (Agaricus and Lepiota families)
- **Features**: 22 categorical attributes (cap-shape, cap-surface, cap-color, bruises, odor, etc.)
- **Classes**: Edible vs Poisonous
- **License**: CC0 Public Domain
- **Format**: CSV file (374 KB)
- **Note**: Based on The Audubon Society Field Guide to North American Mushrooms (1981)
- **Limitation**: Text-based features, not image-based

## European Datasets

### European Bird Datasets
- **EBBA2**: European Breeding Bird Atlas - 596 breeding bird species in Europe
- **Pan-European Common Bird Monitoring Scheme (PECBMS)**: Continental dataset on breeding bird population changes
- **Western Mediterranean Wetland Birds**: Acoustic bird species classification dataset
- **Article 12 Dataset**: EU Birds Directive data with population sizes and trends (2013-2018)

### European Plant Datasets
- **FloraVeg.EU**: Online database of European vegetation, habitats, and flora
- **TRY Plant Trait Database**: Global plant trait data with 15.4M trait records and 305,594 plant taxa
- **GeoPlant**: European-scale dataset for Plant Species Prediction with 5M+ records
- **sPlotOpen**: Global dataset of vegetation plots with European coverage

### European Wildlife Datasets
- **NESTLER Wild Animal Recognition**: Video dataset with Foxes, Jackals, Ravens, Vultures
- **MammalClub**: Annotated wild mammal dataset for species and individual identification
- **Article 17 Dataset**: EU Habitats Directive data with habitat areas and population data

## Key Findings for App Development

### Strengths:
1. **Comprehensive bird coverage**: NABirds (North America) + EBBA2 (Europe) provide excellent geographic coverage
2. **Large plant dataset**: PlantNet-300K offers substantial training data for plant identification
3. **Open licensing**: Most datasets use permissive licenses suitable for commercial applications
4. **Active research community**: Ongoing development and improvements to datasets

### Challenges:
1. **Limited fungi image datasets**: Most mushroom datasets are feature-based, not image-based
2. **Edibility information**: Need to supplement image datasets with edibility/toxicity databases
3. **Geographic coverage gaps**: Some datasets focus on specific regions
4. **Data integration**: Multiple datasets need to be combined and standardized

### Recommendations:
1. Use NABirds + European datasets for comprehensive bird identification
2. Implement PlantNet-300K as primary plant identification dataset
3. Supplement with specialized edible plant databases
4. Create custom fungi image dataset or use existing smaller image collections
5. Integrate multiple data sources for comprehensive coverage
