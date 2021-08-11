import styles from './table.module.css';
import { useState, useEffect } from 'react';
import TableRow from './table-string';

export default function Table({ rawData }) {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const dataArray = [];
    JSON.parse(rawData).forEach((item) => {
      item.body = JSON.parse(item.body);
      item.created_at = new Date(item.created_at).toLocaleDateString();
      dataArray.push(item);
    });
    setData(dataArray);
  }, [rawData]);

  useEffect(() => {
    // Составляем массив со всеми "анкорами"
    let anchorKeys = [];
    data.map((item) =>
      Object.keys(item.body.host).forEach((key) => anchorKeys.push(key))
    );

    // Убираем дубли
    anchorKeys = Array.from(new Set(anchorKeys));

    // Сортируем
    anchorKeys.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

    // Составляем массив со всеми датами и убираем дубли
    const datesArray = Array.from(new Set(data.map((item) => item.created_at)));

    // Сортируем
    datesArray.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));

    // Готовим итоговый объект для рендера
    const tableItems = [];
    anchorKeys.forEach((key) => {
      tableItems.push({
        name: key,
        data: [],
      });
    });

    //Заполняем ключ data каждого "анкора"
    tableItems.forEach((item) => {
      datesArray.forEach((date) => {
        const yandexDesktop = data.find(
          (dataItem) =>
            dataItem.engine === 'yandex' &&
            dataItem.device === 'desktop' &&
            dataItem.created_at === date
        );
        const yandexMobile = data.find(
          (dataItem) =>
            dataItem.engine === 'yandex' &&
            dataItem.device === 'mobile' &&
            dataItem.created_at === date
        );
        const googleMobile = data.find(
          (dataItem) =>
            dataItem.engine === 'google' &&
            dataItem.device === 'mobile' &&
            dataItem.created_at === date
        );
        const googleDesktop = data.find(
          (dataItem) =>
            dataItem.engine === 'google' &&
            dataItem.device === 'desktop' &&
            dataItem.created_at === date
        );
        item.data.push({
          date: date,
          yandexDesktop: {
            difference: null,
            value:
              yandexDesktop.body.position[item.name] === false
                ? false
                : yandexDesktop.body.position[item.name]
                ? yandexDesktop.body.position[item.name]
                : null,
          },
          yandexMobile: {
            difference: null,
            value:
              yandexMobile.body.position[item.name] === false
                ? false
                : yandexMobile.body.position[item.name]
                ? yandexMobile.body.position[item.name]
                : null,
          },

          googleDesktop: {
            difference: null,
            value:
              googleDesktop.body.position[item.name] === false
                ? false
                : googleDesktop.body.position[item.name]
                ? googleDesktop.body.position[item.name]
                : null,
          },

          googleMobile: {
            difference: null,
            value:
              googleMobile.body.position[item.name] === false
                ? false
                : googleMobile.body.position[item.name]
                ? googleMobile.body.position[item.name]
                : null,
          },
        });
      });
    });

    // Вычисляем разницу с предыдущим днем
    console.log(tableItems);
    tableItems.forEach((tableItem) => {
        tableItem.data.forEach((dataItem, index) => {
            
        })
    })

    setItems(tableItems);
  }, [data]);

  useEffect(() => {
    //  console.log(items);
  }, [items]);

  return (
    <table className={styles.container}>
      <thead>
        <tr className={styles.heading_container}>
          <th className={styles.heading}>Анкор</th>
          {items[0] &&
            items[0].data.map((item) => (
              <th className={styles.heading}>{item.date}</th>
            ))}
        </tr>
      </thead>
      <tbody className={styles.body}>
        {items.map((item) => (
          <TableRow item={item} />
        ))}
      </tbody>
    </table>
  );
}
