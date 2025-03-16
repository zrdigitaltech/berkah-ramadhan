import Modals from '@/app/components/Modals';
import { Fragment } from 'react';
import './share.scss';

import { formatPhoneNumber } from '@/app/helper/utils';

const Index = (props) => {
  const { show, onClose, link_wa } = props;
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://zrdevelopers.github.io/berkah-ramadhan';

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Lihat produk ini: *${formatPhoneNumber(link_wa)}* - ${domain}/${link_wa}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${domain}/${link_wa}`)}`,
    copylink: `${domain}/${link_wa}`
  };

  const handleShare = (platform) => {
    if (platform === 'copylink') {
      navigator.clipboard
        .writeText(shareLinks[platform])
        .then(() => {
          alert('Tautan telah disalin ke clipboard!');
        })
        .catch((err) => {
          console.error('Gagal menyalin tautan:', err);
        });
    } else {
      window.open(shareLinks[platform], '_blank', 'noopener');
    }
  };

  const socialIcons = [
    {
      platform: 'whatsapp',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="#25D366"
          visible="yes"
          name="Whatsapp"
          channel="whatsapp"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.116 3.543A9.71 9.71 0 0 1 12 2.25a9.75 9.75 0 1 1-4.7 18.3l-3.66.84h-.17a.76.76 0 0 1-.73-.92l.84-3.6A9.71 9.71 0 0 1 7.116 3.543ZM7.77 19.08A8.17 8.17 0 0 0 12 20.25a8.25 8.25 0 1 0-7-3.83.74.74 0 0 1 0 .77l-.53 2.51 2.69-.62a.63.63 0 0 1 .36 0 .28.28 0 0 1 .12 0h.13Zm7.112-6.022c.036.013.075.028.118.042.229.079 1.024.47 1.453.68l.247.12c.18.077.348.178.5.3a3.038 3.038 0 0 0-.094.469c-.04.262-.089.58-.206.931a2.588 2.588 0 0 1-1.7 1.2 5.57 5.57 0 0 1-3-.6c-2.13-.852-3.607-2.865-4.12-3.566-.09-.122-.15-.204-.18-.234a5.48 5.48 0 0 1-1-2.6 2.74 2.74 0 0 1 .9-2.1.74.74 0 0 1 .7-.3H9c.029 0 .057-.002.086-.004.171-.012.343-.025.514.404.2.5.7 1.7.8 1.9.1.2.1.3 0 .4a.503.503 0 0 0-.1.2c-.025.075-.05.15-.1.2l-.4.4c-.1.1-.3.3-.1.5a5.34 5.34 0 0 0 1.4 1.7c.58.53 1.26.938 2 1.2.2.1.4.1.5-.1.053-.105.215-.293.387-.49.155-.18.318-.368.413-.51.171-.257.27-.22.482-.142Z"
          ></path>
        </svg>
      )
    },
    {
      platform: 'facebook',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="#3B5998"
          visible="yes"
          name="Facebook"
          channel="facebook"
        >
          <path d="M12.51 21.25h-1.7a1.541 1.541 0 0 1-1.6-1.6v-6h-1A1.54 1.54 0 0 1 6.66 12v-1.7a1.54 1.54 0 0 1 1.6-1.6h1V7.49A4.49 4.49 0 0 1 14 2.75h1.62a1.58 1.58 0 0 1 1.51 1.6v1.1a1.55 1.55 0 0 1-1.6 1.61h-.76a1.09 1.09 0 0 0-.55.08s-.06.17-.06.61v.95h1.8a1.2 1.2 0 0 1 1.17 1.17l-.26 2.3a1.67 1.67 0 0 1-1.59 1.43h-1.17v6a1.54 1.54 0 0 1-1.6 1.65Zm-4.25-11-.1.1V12l.1.1h2.45v7.55l.1.1h1.7l.1-.1V12.1h2.62s.09-.06.11-.16l.2-1.74h-2.93V7.75a1.87 1.87 0 0 1 2.11-2.19h.76l.1-.11v-1.1a.16.16 0 0 0-.05-.11H14a3 3 0 0 0-3.24 3.24v2.72l-2.5.05Z"></path>
        </svg>
      )
    },
    {
      platform: 'copylink',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="var(--color-icon-enabled, #2E3137)"
          visible="yes"
          name="Salin Link"
          channel="salinlink"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.868 4.561c.43.196.815.478 1.132.829a3.78 3.78 0 0 1 1.14 2.72A3.537 3.537 0 0 1 19 10.65L17.61 12a.75.75 0 1 1-1.06-1L18 9.56a1.998 1.998 0 0 0 .68-1.48A2.26 2.26 0 0 0 18 6.43a2 2 0 0 0-1.54-.68 2.26 2.26 0 0 0-1.65.68l-3.5 3.5a2 2 0 0 0-.68 1.48 2.262 2.262 0 0 0 .68 1.65.77.77 0 0 1 0 1.07.79.79 0 0 1-.53.22.77.77 0 0 1-.53-.22 3.8 3.8 0 0 1-1.12-2.75 3.54 3.54 0 0 1 1.14-2.54l3.48-3.48a3.76 3.76 0 0 1 2.75-1.11c.473.01.938.115 1.368.311ZM12.831 10.8a.75.75 0 0 1 .22-.53.742.742 0 0 1 1.06-.01A3.8 3.8 0 0 1 15.23 13a3.538 3.538 0 0 1-1.14 2.52L10.61 19a3.8 3.8 0 0 1-2.67 1.14h-.08A3.46 3.46 0 0 1 5.33 19a3.78 3.78 0 0 1-1.1-2.72 3.54 3.54 0 0 1 1.14-2.54l1.38-1.34a.75.75 0 0 1 1.06 0 .77.77 0 0 1 0 1.07l-1.4 1.4a2 2 0 0 0-.68 1.48A2.26 2.26 0 0 0 6.41 18a2.001 2.001 0 0 0 1.48.68A2.19 2.19 0 0 0 9.55 18l3.5-3.52a2.002 2.002 0 0 0 .68-1.48 2.26 2.26 0 0 0-.68-1.67.75.75 0 0 1-.22-.53Z"
          ></path>
        </svg>
      )
    }
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
            <h4>Mau bagikan lewat mana?</h4>
            <ul className="social-icons mb-0">
              {socialIcons.map(({ platform, icon }) => (
                <li className="mb-0" key={platform}>
                  <a onClick={() => handleShare(platform)}>{icon}</a>
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
