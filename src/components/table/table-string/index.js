import styles from './table-string.module.css';
export default function TableRow({ item, currentPage, itemsPerPage, index }) {
  console.log(item);
  const greenIconSrc =
    'https://ci3.googleusercontent.com/proxy/1m0nAJujhv2WsAI2v0bATa7ehyoIaRh9OMFk2trZjBdhSjvsVetba-KSE7fAZaOEz_-VZqXhelwzhvwL3WkMFxZBkRaj8gZCzw_kc_s=s0-d-e1-ft#https://gogetlinks.net/src/images/icons/delta/up-arrow.png';
  const redIconSrc =
    'https://ci3.googleusercontent.com/proxy/a1lAxQyjv0U-Ig5Q7J15j2HaK9r1xCm21drjbTHhc5EosdArDmBgXGmslmgVWq20G4IYLHkSYbUsD6F1H3daO8zOG0NOR-bmn1zC9VsD5g=s0-d-e1-ft#https://gogetlinks.net/src/images/icons/delta/down-arrow.png';
  return (
    <tr className={styles.container}>
      <td className={styles.cell}>{item.name}</td>
      {item.data.map((item) => (
        <td className={styles.cell}>
          <div className={styles.data}>
            {item.yandexDesktop.value.isPresent && (
              <p className={styles.item}>
                <span className={styles.item_heading_y}>Я.mobile:&nbsp;</span>
                {item.yandexMobile.value.number}
                {item.yandexMobile.difference && (
                  <>
                    <img
                      src={
                        item.yandexMobile.difference > 0
                          ? greenIconSrc
                          : redIconSrc
                      }
                      className={styles.icon}
                      alt={'иконка'}
                    />
                    {Math.abs(item.yandexMobile.difference)}
                  </>
                )}
              </p>
            )}
            {item.yandexMobile.value.isPresent && (
              <p className={styles.item}>
                <span className={styles.item_heading_y}>Я.desktop:&nbsp;</span>
                {item.yandexDesktop.value.number}
                {item.yandexDesktop.difference && (
                  <>
                    <img
                      src={
                        item.yandexDesktop.difference > 0
                          ? greenIconSrc
                          : redIconSrc
                      }
                      className={styles.icon}
                      alt={'иконка'}
                    />
                    {Math.abs(item.yandexDesktop.difference)}
                  </>
                )}
              </p>
            )}

            {item.googleMobile.value.isPresent && (
              <p className={styles.item}>
                <span className={styles.item_heading_g}>G.mobile:&nbsp;</span>
                {item.googleMobile.value.number}
                {item.googleMobile.difference && (
                  <>
                    <img
                      src={
                        item.googleMobile.difference > 0
                          ? greenIconSrc
                          : redIconSrc
                      }
                      className={styles.icon}
                      alt={'иконка'}
                    />
                    {Math.abs(item.googleMobile.difference)}
                  </>
                )}
              </p>
            )}
            {item.googleDesktop.value.isPresent && (
              <p className={styles.item}>
                <span className={styles.item_heading_g}>G.desktop:&nbsp;</span>
                {item.googleDesktop.value.number}
                {item.googleDesktop.difference && (
                  <>
                    <img
                      src={
                        item.googleDesktop.difference > 0
                          ? greenIconSrc
                          : redIconSrc
                      }
                      className={styles.icon}
                      alt={'иконка'}
                    />
                    {Math.abs(item.googleDesktop.difference)}
                  </>
                )}
              </p>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
}
