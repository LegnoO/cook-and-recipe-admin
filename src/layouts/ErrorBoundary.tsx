// ** Library Imports
import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();
  if (error) {
    console.error(error);
    return (
      <div>
        <h2>Something went wrong!</h2>
        <button>Try again</button>
      </div>
    );
  }
};

export default ErrorBoundary;
