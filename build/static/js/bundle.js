// Solar Energy Prediction Dashboard - Production Bundle
import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple placeholder app for deployment
const App = () => {
  return React.createElement('div', {
    className: 'min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col'
  }, [
    // Header
    React.createElement('header', {
      key: 'header',
      className: 'bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 flex items-center border-b border-gray-700 sticky top-0 z-10'
    }, [
      React.createElement('svg', {
        key: 'sun-icon',
        className: 'w-8 h-8 text-yellow-400 mr-3',
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor'
      }, React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
      })),
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-white tracking-wider'
      }, 'Solar Energy Prediction Dashboard')
    ]),
    
    // Main content
    React.createElement('main', {
      key: 'main',
      className: 'flex-grow flex flex-col md:flex-row p-4 gap-4'
    }, [
      // Sidebar
      React.createElement('aside', {
        key: 'sidebar',
        className: 'w-full md:w-1/3 lg:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4'
      }, [
        React.createElement('h2', {
          key: 'config-title',
          className: 'text-xl font-semibold text-center text-white mb-2'
        }, 'System Configuration'),
        React.createElement('p', {
          key: 'config-desc',
          className: 'text-gray-300 text-sm text-center'
        }, 'Configure your solar panel system parameters to generate accurate power output forecasts.'),
        React.createElement('div', {
          key: 'flex-grow',
          className: 'flex-grow'
        }),
        React.createElement('button', {
          key: 'generate-btn',
          className: 'w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out',
          onClick: () => alert('Solar forecasting feature coming soon!')
        }, 'Generate Forecast')
      ]),
      
      // Main content area
      React.createElement('section', {
        key: 'content',
        className: 'w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4'
      }, [
        React.createElement('div', {
          key: 'welcome',
          className: 'flex-grow flex flex-col items-center justify-center text-center bg-gray-800 p-6 rounded-lg shadow-lg'
        }, [
          React.createElement('svg', {
            key: 'welcome-icon',
            className: 'w-24 h-24 text-yellow-400 animate-pulse',
            xmlns: 'http://www.w3.org/2000/svg',
            fill: 'none',
            viewBox: '0 0 24 24',
            stroke: 'currentColor'
          }, React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
          })),
          React.createElement('h2', {
            key: 'welcome-title',
            className: 'mt-6 text-3xl font-bold text-white'
          }, 'Welcome to the Solar Dashboard'),
          React.createElement('p', {
            key: 'welcome-desc',
            className: 'mt-2 max-w-lg text-gray-300'
          }, 'Your solar energy prediction dashboard is now deployed! Configure your system parameters to generate accurate power output forecasts.'),
          React.createElement('p', {
            key: 'welcome-note',
            className: 'mt-4 text-sm text-gray-400'
          }, 'Built with React 19 and deployed on AWS Elastic Beanstalk.')
        ])
      ])
    ])
  ]);
};

// Mount the app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
}
