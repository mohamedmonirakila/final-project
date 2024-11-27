import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize the state to track if an error has occurred
    this.state = { hasError: false };
  }

  // This lifecycle method updates the state when an error is caught
  static getDerivedStateFromError(error) {
    // Update state so the fallback UI will render
    return { hasError: true };
  }

  // This method allows you to log the error for debugging or reporting
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // You can send error details to an error tracking service here
  }

  render() {
    // Check if there's an error
    if (this.state.hasError) {
      // Render fallback UI when an error is caught
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    // If no error, render children components as usual
    return this.props.children;
  }
}

export default ErrorBoundary;
