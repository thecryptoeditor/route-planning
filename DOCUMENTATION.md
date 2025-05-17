# Route Planning Application Documentation

## Overview
This application is a route planning visualization tool that uses a Gantt chart to display and manage delivery routes and schedules. It's built using React and the vis-timeline library to create interactive timeline visualizations.

## Project Structure
```
route-planning/
├── src/
│   ├── components/
│   │   └── GanttChart/
│   │       ├── GanttChart.jsx
│   │       ├── GanttChart.css
│   │       └── TimeRangeSlider.jsx
│   ├── hooks/
│   │   └── useGanttData.js
│   ├── utils/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── public/
└── package.json
```

## Technical Stack
- React.js
- vis-timeline (for Gantt chart visualization)
- vis-data (for data management)
- CSS3 for styling

## Key Components

### 1. GanttChart Component
The main visualization component that renders the interactive Gantt chart. Features include:
- Interactive timeline visualization
- Customizable tooltips
- Zoom functionality
- Vertical and horizontal scrolling
- Custom styling for timeline items

### 2. TimeRangeSlider Component
A control component that allows users to:
- Adjust the time window
- Control zoom levels
- Navigate through different time periods

### 3. useGanttData Hook
A custom React hook that manages:
- Data transformation for the Gantt chart
- Time window calculations
- Zoom level state
- Data updates and refreshes

## Setup and Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd route-planning
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Data Structure

The Gantt chart expects data in the following format:

```javascript
{
  groups: [
    {
      id: string | number,
      content: string
    }
  ],
  items: [
    {
      id: string | number,
      group: string | number,
      content: string,
      start: Date,
      end: Date,
      title: string // for tooltip
    }
  ]
}
```

## Customization

### Styling
- The Gantt chart's appearance can be customized through `GanttChart.css`
- Timeline items use custom CSS classes for styling
- Responsive design considerations are included

### Configuration Options
The Gantt chart supports various configuration options:
- Stack mode (enabled/disabled)
- Vertical/horizontal scrolling
- Custom tooltips
- Time axis formatting
- Item templates

## Best Practices

1. Data Management:
   - Keep data transformations in the useGanttData hook
   - Use proper data structures (DataSet) for optimal performance

2. Performance:
   - Implement proper memoization for callbacks
   - Use appropriate zoom levels for large datasets
   - Optimize rendering with proper key props

3. UI/UX:
   - Maintain consistent styling
   - Provide clear visual feedback for interactions
   - Ensure responsive design works across devices

## Application Logic

### 1. Data Flow Architecture
```
[Input Data] → [useGanttData Hook] → [GanttChart Component] → [Visual Timeline]
                      ↓                        ↓
              [Data Processing]         [Timeline Config]
                      ↓                        ↓
              [State Management]    [Interaction Handlers]
```

### 2. Core Logic Components

#### Data Processing (useGanttData Hook)
```javascript
// Key operations performed:
1. Input data transformation
   - Convert raw data to vis-timeline compatible format
   - Process dates and timestamps
   - Generate unique IDs for items and groups

2. Time window calculations
   - Calculate optimal view range
   - Handle timezone conversions
   - Manage date boundaries

3. Zoom level management
   - Define zoom presets (hour, day, week, month)
   - Calculate appropriate time scales
   - Handle zoom transitions
```

#### Gantt Chart Logic
```javascript
// Main functionality:
1. Timeline Initialization
   - Create DataSet instances
   - Configure timeline options
   - Set up event listeners

2. Item Management
   - Handle item rendering
   - Manage item updates
   - Process item interactions

3. View Control
   - Handle scrolling
   - Manage viewport
   - Process zoom events
```

### 3. State Management

#### Component States
1. Timeline State
   - Current view window
   - Zoom level
   - Selected items
   - Viewport position

2. Data State
   - Groups dataset
   - Items dataset
   - Loading states
   - Error states

#### State Updates
```javascript
// Example state update flow:
1. User Action (e.g., zoom change)
2. Event Handler Triggered
3. State Update Calculation
4. Component Re-render
5. Timeline Update
```

### 4. Event Handling

#### User Interactions
1. Zoom Events
   ```javascript
   handleZoomChange = (newLevel) => {
     // Calculate new time window
     // Update timeline view
     // Refresh data if needed
   }
   ```

2. Navigation Events
   ```javascript
   handleTimeChange = (newWindow) => {
     // Update time window
     // Adjust visible range
     // Update data points
   }
   ```

3. Item Interactions
   ```javascript
   handleItemClick = (item) => {
     // Process selection
     // Show details
     // Trigger callbacks
   }
   ```

### 5. Data Processing Pipeline

#### Input Data Processing
```javascript
1. Raw Data → Validation → Transformation → Timeline Format
2. Date Processing:
   - Parse timestamps
   - Handle timezones
   - Calculate durations

3. Group Processing:
   - Generate hierarchy
   - Sort groups
   - Apply filters
```

#### Output Generation
```javascript
1. Timeline Items:
   - Generate visual elements
   - Apply styling
   - Calculate positions

2. Timeline Groups:
   - Process hierarchies
   - Apply grouping rules
   - Handle nested items
```
