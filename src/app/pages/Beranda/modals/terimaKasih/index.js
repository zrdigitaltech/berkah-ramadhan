import Modals from '@/app/components/Modals';
import { Fragment } from 'react';

const Index = (props) => {
  const { show, onClose, } = props;

  return (
    <Modals
      title="Konfirmasi Pemesanan"
      show={show}
      onClose={onClose}
      modalBody={
        <Fragment>
          <div className='text-center'>
            Terima kasih telah mengirimkan pemesanan Anda!
          </div>
        </Fragment>
      }
      modalFooter={
        <Fragment>
        </Fragment>
      }
    />
  );
};

export default Index;
