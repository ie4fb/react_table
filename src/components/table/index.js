import styles from './table.module.css';
import { useState, useEffect, useRef } from 'react';
import TableRow from './table-string';

export default function Table({ rawData }) {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [isNamesSortAsc, setIsNamesSortAsc] = useState(true);
  const [isSortSelectorVisible, setIsSortSelectorVisible] = useState(false);
  const [isDateSortIngAsc, setIsDateSortIngAsc] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState('');
  const [sortSelectorCoordinates, setSortSelectorCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [pages, setPages] = useState([]);
  const inputRef = useRef();
  const dateFromInputRef       = useRef();
  const dateToInputRef = useRef();

  // Начальное значение элементов на странице
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Страница по-умолчанию
  const [currentPage, setCurrentPage] = useState(1);

  const [visibility, setVisibility] = useState(null);

  const toggleSort = (props, e) => {
    setIsSortSelectorVisible(false);
    const arr = items;
    if (props.sortBy === 'name') {
      //Сортировка по имени
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
      //Сортировка по дате
      arr.sort((a, b) =>
        parseInt(
          a.data[selectedDateIndex][props.sortingKey].value.number
            .toString()
            .split('+')[0]
        ) >
        parseInt(
          b.data[selectedDateIndex][props.sortingKey].value.number
            .toString()
            .split('+')[0]
        )
          ? isDateSortIngAsc
            ? -1
            : 1
          : parseInt(
              b.data[selectedDateIndex][props.sortingKey].value.number
                .toString()
                .split('+')[0]
            ) >
            parseInt(
              a.data[selectedDateIndex][props.sortingKey].value.number
                .toString()
                .split('+')[0]
            )
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
    setSelectedDateIndex(e.target.id.split(',')[0]);
    console.log(e.target.id.split(',')[0]);
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
            if (
              dataItem[key].value &&
              tableItem.data[index - 1][key].value &&
              dataItem[key].value.number &&
              tableItem.data[index - 1][key].value.number
            ) {
              dataItem[key].difference =
                tableItem.data[index - 1][key].value.number -
                  dataItem[key].value.number || null;
            }
          });
        }
      });
    });

    // Вычисляем видимость

    setItems(tableItems);
  }, [data]);

  useEffect(() => {
    let visibilityData = {};
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].data.length; j++) {
        visibilityData[items[i].data[j].date] = {
          visibleAmount: 0,
          totalAmount: 0,
        };
      }
    }

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].data.length; j++) {
        for (let k = 1; k < Object.keys(items[i].data[j]).length; k++) {
          if (
            items[i].data[j][Object.keys(items[i].data[j])[k]].value.number <=
            10
          ) {
            visibilityData[items[i].data[j].date].visibleAmount += 1;
          }
          if (
            items[i].data[j][Object.keys(items[i].data[j])[k]].value.isPresent
          ) {
            visibilityData[items[i].data[j].date].totalAmount += 1;
          }
        }
      }
    }
    setVisibility(visibilityData);
    const pages = Math.ceil(items.length / itemsPerPage);
    const pagesArr = [];
    for (let i = 1; i <= pages; i++) {
      pagesArr.push(i);
    }
    setPages(pagesArr);
  }, [items, itemsPerPage]);
  const applyDateFilter = () => {
      console.log(dateFromInputRef.currrent, dateToInputRef.current)
  }

  const changeItemsPerPage = () => {
    setItemsPerPage(parseInt(inputRef.current.value));
  };

  const PageButton = ({ item }) => {
    return (
      <button
        id={item}
        onClick={() => {
          setCurrentPage(item);
        }}
        className={`${styles.button} ${
          currentPage === item ? styles.button_active : ''
        }`}
      >
        {item}
      </button>
    );
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.date_container}>
        <span>Начало периода&nbsp;</span>{' '}
        <input ref={dateFromInputRef} id="from" type='date' />
        <span>Конец периода&nbsp;</span>{' '}
        <input ref={dateToInputRef} id="to" type='date' />
        <button className={styles.button} onClick={applyDateFilter}>применить</button>
      </div>
      <table className={styles.container}>
        <thead>
          <tr className={styles.heading_container}>
            <th
              className={styles.heading}
              onClick={(e) =>
                toggleSort({ sortBy: 'name', sortingKey: null }, e)
              }
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
                  <span id={`${index},${item.date}`}> {item.date}</span>{' '}
                  {visibility[item.date] && (
                    <div id={`${index},${item.date}`}>
                      Видимость{' '}
                      {(
                        (100 * visibility[item.date].visibleAmount) /
                        visibility[item.date].totalAmount
                      ).toFixed(1)}
                      %
                    </div>
                  )}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className={styles.body}>
          {(currentPage === 'Все'
            ? items
            : items.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
          ).map((item, index) => (
            <TableRow
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              index={index}
              key={index}
              item={item}
            />
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
          <span
            className={styles.option}
            onClick={(e) =>
              toggleSort({ sortBy: 'date', sortingKey: 'yandexMobile' }, e)
            }
          >
            Я.mobile
          </span>
          <span
            className={styles.option}
            onClick={(e) =>
              toggleSort({ sortBy: 'date', sortingKey: 'yandexDesktop' }, e)
            }
          >
            Я.desktop
          </span>

          <span
            className={styles.option}
            onClick={(e) =>
              toggleSort({ sortBy: 'date', sortingKey: 'googleDesktop' }, e)
            }
          >
            G.desktop
          </span>
          <span
            className={styles.option}
            onClick={(e) =>
              toggleSort({ sortBy: 'date', sortingKey: 'googleMobile' }, e)
            }
          >
            G.mobile
          </span>
        </div>
      )}
      <div className={styles.pagination_container}>
        <div className={styles.input_container}>
          <span> Элементов на странице&nbsp;</span>
          <input
            type='number'
            ref={inputRef}
            className={styles.input}
            placeholder={'Элементов на странице'}
            defaultValue={itemsPerPage}
            min={1}
          />
          <button className={styles.button} onClick={changeItemsPerPage}>
            Применить
          </button>
        </div>
        <div className={styles.buttons}>
          <button
            onClick={() => setCurrentPage('Все')}
            className={`${styles.button} ${
              currentPage === 'Все' ? styles.button_active : ''
            }`}
          >
            Все
          </button>
          {pages.map((item, index) => (
            <PageButton item={item} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
