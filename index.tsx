// Import useEffect from React
import React, { useEffect } from 'react';

interface AppProps {
  title?: string;
}

const App: React.FC<AppProps> = ({ title = 'Default Title' }) => {
  // This hook will update the document's title whenever the title prop changes
  useEffect(() => {
    document.title = title;
  }, [title]);

  // Your existing App component return function remains here
  return (
    <div>
      {/* Your existing App content */}
      <h1>Welcome to DecStorage</h1>
    </div>
  );
}

export default App;
```
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Render your App component within React.StrictMode
ReactDOM.render(
  <React.StrictMode>
    {/* Now with a dynamic title */}
    <App title="DecStorage - Home" />
  </React.StrictMode>,
  document.getElementById('root')
);