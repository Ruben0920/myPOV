import { useState, useEffect } from 'react';
import { useLoadTokens } from 'app/components/useLoadToken';

const useCheckTokensNotNull = (): boolean => {
  const [tokensNotNull, setTokensNotNull] = useState(false);
  const { accessToken, refreshToken, isLoading, error } = useLoadTokens({ tokenType: 'both' });

  useEffect(() => {
    if (!isLoading && !error && accessToken !== null && refreshToken !== null) {
      setTokensNotNull(true);
    } else {
      setTokensNotNull(false);
    }
  }, [accessToken, refreshToken, isLoading, error]);

  return tokensNotNull;
};

export default useCheckTokensNotNull;
