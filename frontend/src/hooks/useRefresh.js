import { useState, useCallback } from 'react';

const useRefresh = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // A memoized function to "tick" the key upward
  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return [refreshKey, triggerRefresh];
};

export default useRefresh;