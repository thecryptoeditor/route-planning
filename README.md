# Route Planning Gantt Chart

A React application that displays a Gantt chart visualization for route planning and order tracking.

## Features

- Interactive Gantt chart displaying routes and their associated orders
- Time-range slider to control the Gantt chart zoom level:
  - 12-hour range
  - 4-hour range
  - 1-hour range
- Visual representation of orders with:
  - Width (thickness) representing fixing time (duration)
  - Spacing proportional to time gaps between orders
- Detailed route information in a tabular format

## Project Structure

The project follows a modular, component-based architecture:

```
src/
├── components/         # UI components
│   ├── GanttChart/     # Gantt chart components
│   └── Layout/         # Layout components
├── utils/              # Utility functions for data transformation and time handling
├── hooks/              # Custom React hooks
└── mockData.js         # Sample route data
```

## Technologies Used

- React.js - UI framework
- vis-timeline - Gantt chart visualization library
- date-fns - Date utility library
- CSS Grid/Flexbox - Layout and responsiveness

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/gantt-route-planner.git
   cd gantt-route-planner
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Implementation Details

### Data Processing

The application transforms the provided JSON data into a format compatible with the vis-timeline library:

- Routes are converted into timeline groups
- Orders (sequence items) are converted into timeline items
- Time strings are parsed and formatted using date-fns

### Gantt Chart Implementation

The Gantt chart is implemented using the vis-timeline library, which provides:

- Horizontal timeline visualization
- Grouping capability for routes
- Item rendering for orders
- Time scale and zooming functionality

### Zooming Mechanism

The application features a custom zoom control with three predefined levels:
- Large: 12-hour view
- Medium: 4-hour view
- Small: 1-hour view

The zoom functionality is implemented using the vis-timeline's window API, adjusting the visible time range based on the selected zoom level.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- vis-timeline library for the Gantt chart visualization
- date-fns for date manipulation utilities