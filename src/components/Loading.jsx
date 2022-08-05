import has from 'has';
import { errors, labels } from '../api/constants';

function Loading(props) {
  let message = labels.loading;
  if (has(props, 'error') && props.error && has(props.error, 'message')) {
    console.log(props.error.message);
    message = errors.loading;
  }
  return (
    <div className="loading row justify-content-center">
        <div className="col-auto align-self-center">
            { message }
        </div>
    </div>
  );
}

export default Loading;
