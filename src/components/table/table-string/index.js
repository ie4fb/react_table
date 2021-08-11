import styles from './table-string.module.css';
export default function TableRow({ item }) {
  return (
    <tr className={styles.container}>
      <td className={styles.cell}>{item.name}</td>
      {item.data.map((item) => (
        <td className={styles.cell}>
          <div className={styles.data}>
            {item.yandexDesktop !== null && (
              <p className={styles.item}>
                <span className={styles.item_heading_y}>Я.mobile:&nbsp;</span>
                {item.yandexDesktop.value || '100+'}
              </p>
            )}
            {item.yandexMobile !== null && (
              <p className={styles.item}>
                <span className={styles.item_heading_y}>Я.desktop:&nbsp;</span>
                {item.yandexMobile.value || '100+'}
              </p>
            )}
            {item.googleDesktop !== null && (
              <p className={styles.item}>
                <span className={styles.item_heading_g}>G.desktop:&nbsp;</span>
                {item.googleDesktop.value || '100+'}
              </p>
            )}
            {item.googleMobile !== null && (
              <p className={styles.item}>
                <span className={styles.item_heading_g}>G.mobile:&nbsp;</span>
                {item.googleMobile.value || '100+'}
              </p>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
}
