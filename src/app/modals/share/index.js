import Modals from '@/app/components/Modals';
import { Fragment } from 'react';

import { formatPhoneNumber } from '@/app/helper/utils';

const Index = (props) => {
  const { show, onClose, link_wa } = props;

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Lihat artikel ini: *${'title'}} | ZRDevelopers* - ${'url'}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('url')}`,
    copylink: `${encodeURIComponent('url')}`
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'noopener');
  };

  const socialIcons = [
    { platform: 'whatsapp', iconClass: 'fab fa-whatsapp', color: '#fff' },
    { platform: 'facebook', iconClass: 'fab fa-facebook-f', color: '#fff' },
    { platform: 'linkedin', iconClass: 'fab fa-linkedin-in', color: '#fff' }
  ];

  return (
    <Modals
      title="Bagikan ke Temanmu"
      show={show}
      onClose={onClose}
      position="top"
      modalBody={
        <Fragment>
          <div className="card-toko mb-3">
            <h3 className="text-2xl font-bold">{formatPhoneNumber(link_wa)}</h3>
            <small>Kota Tangerang</small>
          </div>
          <div>
            Mau bagikan lewat mana?
            <br />
            <ul className="social-icons mb-0">
              {socialIcons.map(({ platform, iconClass, color }) => (
                <li className="mb-0" key={platform}>
                  <a onClick={() => handleShare(platform)} target="_blank" rel="noopener">
                    <i className={iconClass} style={{ color }}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Fragment>
      }
      modalFooter={<Fragment></Fragment>}
    />
  );
};

export default Index;
