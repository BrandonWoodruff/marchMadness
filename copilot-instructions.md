# Code Style Guidelines for March Madness Prediction Project

## Key Principles

- Write concise, technical, and maintainable code
- Prioritize reproducibility in data analysis workflows
- Use functional programming where appropriate; avoid unnecessary classes
- Prefer vectorized operations over explicit loops for better performance
- Use descriptive variable names that reflect basketball-specific concepts
- Follow PEP 8 style guidelines for Python code

## Data Analysis and Manipulation

- Use pandas for tournament data manipulation and feature engineering
- Prefer method chaining for data transformations when possible
- Use `loc` and `iloc` for explicit data selection
- Utilize `groupby` operations for efficient team and conference-level aggregation
- Structure data to align with PostgreSQL schema requirements

## Feature Engineering Focus Areas

- **Seed-based Features**: Calculate seed differences, seed products, and historical performance by seed
- **Team Performance Metrics**: Compute win percentages, point differentials, offensive/defensive efficiency
- **Detailed Statistics**: Process field goal percentages, turnover rates, rebound rates, etc.
- **Ranking Systems**: Incorporate various rankings from the Massey Ordinals file
- **Conference Strength**: Create indicators based on conference performance in past tournaments
- **Game Location**: Account for home/away/neutral performance variations

## PostgreSQL Integration

- Ensure data types align with PostgreSQL column specifications
- Use appropriate naming conventions for database compatibility
- Include index columns where needed for efficient database operations
- Follow consistent date/time formatting for temporal data
- Structure output DataFrames to match target database tables

## Visualization for Analysis

- Create informative visualizations to support feature selection and model evaluation
- Use appropriate color schemes with basketball context in mind
- Include proper labels, titles, and legends in all exploratory plots
- Document visualization insights that inform modeling decisions

## Project Workflow Best Practices

- Structure notebooks with clear sections using markdown cells
- Document data sources, assumptions, and methodologies
- Implement data quality checks for tournament data validation
- Handle missing statistics appropriately (imputation, removal, or flagging)
- Use version control for tracking changes in notebooks and scripts

## Jupyter Notebook Best Practices

- Organize notebooks with clear cell structure (imports, config, processing, visualization, output)
- Use markdown cells to document analysis steps and key findings
- Number cells sequentially for logical execution flow
- Restart kernel and run all cells periodically to verify reproducibility
- Keep notebooks modular and focused on specific analysis tasks
- Extract reusable functions into separate utility notebooks or Python modules
- Document data exploration and visualization insights directly in markdown cells
- Clear outputs before committing to version control to reduce file size
- Use notebook extensions like `jupyter_contrib_nbextensions` for enhanced functionality
- Consider using `nbconvert` to generate reports from analysis notebooks

## Performance Optimization

- Use vectorized operations in pandas and numpy for improved performance
- Utilize efficient data structures for large tournament datasets
- Profile code to identify and optimize bottlenecks in prediction pipelines
- Consider batch processing for historical tournament data
- Avoid storing large datasets in notebook memory - load only necessary subsets
- Use `%who` and `%whos` magic commands to monitor memory usage
- Clear unnecessary variables with `del` when no longer needed

## Key Conventions

1. Begin with exploratory analysis of tournament data and team statistics
2. Create consistent data processing pipelines for reproducible feature engineering
3. Document all data transformations applied to raw tournament data
4. Maintain clear separation between data preparation and model training stages
5. Create organized export functions for PostgreSQL integration
6. Name notebooks descriptively according to their analytical purpose

## Dependencies

- pandas
- numpy
- matplotlib
- seaborn
- scikit-learn
- psycopg2 (for PostgreSQL connectivity)
- sqlalchemy (for database operations)
- jupyter
- jupyter_contrib_nbextensions
- nbconvert

## Appendix: Feature Categories Reference

### Seed-based Features
- Seed difference
- Seed product
- Historical upset rates by seed matchup

### Team Performance Metrics
- Season win percentage
- Conference win percentage
- Point differential
- Offensive/defensive efficiency

### Detailed Statistics Features
- Field goal percentage (overall, 3PT, 2PT)
- Free throw percentage
- Turnover rate
- Rebound rates (offensive, defensive)
- Assist-to-turnover ratio

### Ranking System Features
- AP Poll ranking
- Coaches Poll ranking
- Various computer rankings (KenPom, Sagarin, etc.)
- Composite ranking metrics

### Conference Strength Indicators
- Conference tournament performance
- Historical March Madness success
- Inter-conference game results
- Conference RPI/strength metrics

### Game Location Features
- Home win percentage
- Away win percentage
- Neutral court performance
- Distance from team campus to tournament site

## Machine Learning Project Structure
.
├── Data
│   ├── 2024_tourney_seeds.csv
│   ├── Cities.csv
│   ├── Conferences.csv
│   ├── MConferenceTourneyGames.csv
│   ├── MGameCities.csv
│   ├── MMasseyOrdinals_thruSeason2024_day128.csv
│   ├── MNCAATourneyCompactResults.csv
│   ├── MNCAATourneyDetailedResults.csv
│   ├── MNCAATourneySeedRoundSlots.csv
│   ├── MNCAATourneySeeds.csv
│   ├── MNCAATourneySlots.csv
│   ├── MRegularSeasonCompactResults.csv
│   ├── MRegularSeasonDetailedResults.csv
│   ├── MSeasons.csv
│   ├── MSecondaryTourneyCompactResults.csv
│   ├── MSecondaryTourneyTeams.csv
│   ├── MTeamCoaches.csv
│   ├── MTeamConferences.csv
│   ├── MTeamSpellings.csv
│   ├── MTeams.csv
│   ├── WGameCities.csv
│   ├── WNCAATourneyCompactResults.csv
│   ├── WNCAATourneyDetailedResults.csv
│   ├── WNCAATourneySeeds.csv
│   ├── WNCAATourneySlots.csv
│   ├── WRegularSeasonCompactResults.csv
│   ├── WRegularSeasonDetailedResults.csv
│   ├── WSeasons.csv
│   ├── WTeamConferences.csv
│   ├── WTeamSpellings.csv
│   ├── WTeams.csv
│   └── sample_submission.csv
├── MachineLearningAlgo
│   ├── data_cleaning.ipynb
│   └── datacleaning.py
├── README.md
└── code-style.md