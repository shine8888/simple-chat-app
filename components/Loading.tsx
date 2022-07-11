import { StyledLoadingWrapper } from '../styled-components/StyledLoading';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  return (
    <StyledLoadingWrapper>
      <CircularProgress />
    </StyledLoadingWrapper>
  );
};

export default Loading;
