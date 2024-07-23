# World Happiness Report Narrative Visualization

## Overview

This project presents an interactive narrative visualization based on the World Happiness Report dataset for the years 2016 to 2019. Developed using D3.js, this visualization provides insights into global happiness scores, trends over time, and factors contributing to happiness across various countries.

## Scenes Description

### Scene One: Global Happiness Overview (2019)

**Description**: This scene features a choropleth map displaying the happiness scores of countries for the year 2019. The map uses a color gradient with varying shades of red, where darker shades represent higher happiness scores.

**Key Features**:
- **Hover Interaction**: Hovering over a country displays a tooltip with the country name and its happiness score.
- **Dropdown Menu**: A dropdown menu allows users to select a specific country. When selected, the chosen country is highlighted on the map while others are grayed out.

**Purpose**: This scene provides a visual overview of global happiness distribution in 2019, allowing users to quickly identify which countries have higher or lower happiness scores.

### Scene Two: Happiness Score Trends (2016-2019)

**Description**: This scene includes a bar chart that compares the happiness scores of countries across the years 2016 to 2019. 

**Key Features**:
- **Dropdown Menu**: Users can select a country from a dropdown list to view its happiness score trends over the selected years.
- **Bar Chart Visualization**: The bar chart displays the annual happiness scores for the chosen country, enabling users to observe changes and trends over time.

**Purpose**: This scene allows users to analyze how happiness scores have evolved for different countries over the years, offering insights into long-term trends and fluctuations.

### Scene Three: Factors Influencing Happiness

**Description**: This scene presents an interactive bar chart breaking down the factors contributing to the happiness score of a selected country and year. Factors include GDP per capita, social support, healthy life expectancy, freedom to make life choices, generosity, and perceptions of corruption.

**Key Features**:
- **Dropdown Menus**: 
  - **Year Selector**: Allows users to choose a year.
  - **Country Selector**: Allows users to select a country.
- **Bar Chart Visualization**: The bar chart displays the values of various factors contributing to happiness for the selected country and year. The chart also includes a title above the visualization that shows the happiness score for the chosen country and year.

**Purpose**: This scene provides an in-depth view of how different factors influence happiness scores, enabling users to explore the relative importance of each factor for a given country and year.

## How to Use

1. **Scene One**: Explore the global distribution of happiness scores by interacting with the map and using the dropdown menu to highlight specific countries.
2. **Scene Two**: Analyze happiness score trends over the years by selecting a country from the dropdown menu and observing the bar chart.
3. **Scene Three**: Investigate the factors contributing to happiness by selecting a country and year from the dropdown menus. The bar chart will update to show the values of different factors and the happiness score.




Annotations
Annotations are used for messaging and drawing attention to specific aspects of the data within each scene. In your project, annotations could include:

Scene One:

Tooltips that display country names and happiness scores when hovering over countries on the map.
Labels indicating high and low happiness score regions on the color scale legend.
Scene Two:

Tooltips that show detailed information about each bar (e.g., country name, happiness score, and other metrics) when hovering over bars.
Titles and labels explaining the context of the chart (e.g., "Happiness Scores in 2019").
Scene Three:

Similar tooltips and labels as in Scene Two, adapted to the specific data being visualized.
Any additional annotations that highlight significant trends or outliers in the data.
Parameters
Parameters are the variables used to control the scenes and the elements within the charts. In your project, these parameters might include:

Scene One:

selectedCountry: The country selected from the dropdown menu to highlight on the map.
happinessScore: The happiness score used to determine the color of each country on the map.
year: The year of the data being displayed (2019 in this case).
Scene Two:

selectedYear: The year for which happiness scores are being displayed in the bar chart.
happinessScores: The array of happiness scores for the selected year.
highlightedCountry: The country being highlighted (if any) when hovering over bars.
Scene Three:

comparisonMetric: The metric being compared across countries (e.g., GDP per capita, social support).
happinessScores: The happiness scores used in the comparison.
highlightedCountry: The country being highlighted when hovering over bars or other elements.
Triggers
Triggers are the actions that cause parameters to change state, leading to updates in the visualization. In your project, triggers might include:

Scene One:

Dropdown Selection: When a user selects a country from the dropdown menu, the selectedCountry parameter changes, triggering the map to update and highlight the selected country.
Scene Two:

Hovering Over Bars: When a user hovers over a bar, the highlightedCountry parameter changes, triggering tooltips to display detailed information about that country.
Year Selection: If there is a mechanism to change the year being displayed (e.g., a slider), changing the year would update the selectedYear parameter and refresh the chart with data for the new year.
Scene Three:

Metric Selection: If there is a way to change the comparison metric (e.g., a dropdown or buttons), selecting a different metric would update the comparisonMetric parameter and refresh the chart to reflect the new comparison.
Hovering Over Elements: Similar to Scene Two, hovering over chart elements would change the highlightedCountry parameter, triggering tooltips or other annotations.
By carefully defining and implementing these components, you can create a coherent and engaging narrative visualization that guides users through your data with clear messaging and interactive elements.