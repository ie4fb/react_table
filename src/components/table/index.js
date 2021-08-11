import styles from './table.module.css';
import { useState, useEffect } from 'react';
import TableRow from './table-string';

export default function Table({ rawData }) {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [isNamesSortAsc, setIsNamesSortAsc] = useState(true);
  const [isSortSelectorVisible, setIsSortSelectorVisible] = useState(false);
  const [isDateSortIngAsc, setIsDateSortIngAsc] = useState(false);
  const [sortSelectorCoordinates, setSortSelectorCoordinates] = useState({
    x: 0,
    y: 0,
  });

  const toggleSort = (props, e) => {
    const arr = items;
    if (props.sortBy === 'name') {
      arr.sort((a, b) =>
        a.name > b.name
          ? isNamesSortAsc
            ? -1
            : 1
          : b.name > a.name
          ? isNamesSortAsc
            ? 1
            : -1
          : 0
      );
      setItems(arr);
      setIsNamesSortAsc((prevState) => !prevState);
    } else if (props.sortBy === 'date') {
      const index = e.target.id.split(',')[0];
      const date = e.target.id.split(',')[1];
      console.log(index, date);
      console.log(items);
      console.log(
        arr[0].data[index].yandexDesktop.value.number,
          arr[2].data[index].yandexDesktop.value.number
      );
      arr.sort((a, b) =>
        a.data[index].yandexDesktop.value.number > b.data[index].yandexDesktop.value.number
          ? isDateSortIngAsc
            ? -1
            : 1
          : b.data[index].yandexDesktop.value.number >
            a.data[index].yandexDesktop.value.number
          ? isDateSortIngAsc
            ? 1
            : -1
          : 0
      );
      setItems(arr);
      setIsDateSortIngAsc((prevState) => !prevState);
    }
  };

  const toggleSortSelectorVisibility = (e) => {
    setIsSortSelectorVisible(true);
    setSortSelectorCoordinates({ x: e.pageX, y: e.pageY });
    toggleSort({ sortBy: 'date' }, e);
  };
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
    anchorKeys.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));

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
            value: {
              isPresent:
                yandexDesktop.body.position[item.name] === false ||
                yandexDesktop.body.position[item.name]
                  ? true
                  : false,
              number:
                yandexDesktop.body.position[item.name] === false
                  ? '100+'
                  : yandexDesktop.body.position[item.name]
                  ? yandexDesktop.body.position[item.name]
                  : null,
            },
          },
          yandexMobile: {
            difference: null,
            value: {
              isPresent:
                yandexMobile.body.position[item.name] === false ||
                yandexMobile.body.position[item.name]
                  ? true
                  : false,
              number:
                yandexMobile.body.position[item.name] === false
                  ? '100+'
                  : yandexMobile.body.position[item.name]
                  ? yandexMobile.body.position[item.name]
                  : null,
            },
          },

          googleDesktop: {
            difference: null,
            value: {
                isPresent:
                googleDesktop.body.position[item.name] === false ||
                googleDesktop.body.position[item.name]
                  ? true
                  : false,
              number:
                googleDesktop.body.position[item.name] === false
                  ? '100+'
                  : googleDesktop.body.position[item.name]
                  ? googleDesktop.body.position[item.name]
                  : null,
            },
          },

          googleMobile: {
            difference: null,
            value: {
                isPresent:
                googleMobile.body.position[item.name] === false ||
                googleMobile.body.position[item.name]
                  ? true
                  : false,
              number:
                googleMobile.body.position[item.name] === false
                  ? '100+'
                  : googleMobile.body.position[item.name]
                  ? googleMobile.body.position[item.name]
                  : null,
            },
          },
        });
      });
    });

    // Вычисляем разницу с предыдущим днем
    tableItems.forEach((tableItem) => {
      tableItem.data.forEach((dataItem, index) => {
        if (tableItem.data[index - 1]) {
          Object.keys(dataItem).forEach((key) => {
            if (dataItem[key].value  && tableItem.data[index - 1][key].value && dataItem[key].value.number && tableItem.data[index - 1][key].value.number) {
              dataItem[key].difference =
                tableItem.data[index - 1][key].value.number - dataItem[key].value.number || null;
            }
          });
        }
      });
    });

    // Вычисляем видимость

    setItems(tableItems);
  }, [data]);

  useEffect(() => {
    //  console.log(items);
  }, [items]);

  return (
    <section className={styles.wrapper}>
      <table className={styles.container}>
        <thead>
          <tr className={styles.heading_container}>
            <th
              className={styles.heading}
              onClick={(e) => toggleSort({ sortBy: 'name' }, e)}
            >
              Анкор
            </th>
            {items[0] &&
              items[0].data.map((item, index) => (
                <th
                  key={index}
                  index={index}
                  className={styles.heading}
                  id={`${index},${item.date}`}
                  onClick={toggleSortSelectorVisibility}
                >
                  {item.date}
                  <div className={styles.sort_options}></div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody className={styles.body}>
          {items.map((item) => (
            <TableRow item={item} />
          ))}
        </tbody>
      </table>
      {isSortSelectorVisible && (
        <div
          style={{
            top: sortSelectorCoordinates.y,
            left: sortSelectorCoordinates.x,
          }}
          className={styles.sort_selector}
        >
          <span className={styles.selector_heading}>
            Выберите поле для сортировки
          </span>
          <span className={styles.option}>Я.desktop</span>
          <span className={styles.option}>Я.mobile</span>
          <span className={styles.option}>G.desktop</span>
          <span className={styles.option}>G.mobile</span>
        </div>
      )}
    </section>
  );
}
