import { useState, useEffect, useRef } from 'react';
import styles from './competitors-list.module.css';

export default function CompetitorsList({ data }) {
  const [items, setItems] = useState(null);
  // Количество хостов по-умолчанию
  const [hostsNumber, setHostsNumber] = useState(10);
  const inputRef = useRef();

  useEffect(() => {
    if (data) {
      // Ищем последнюю дату, составляем массив с данными по этой дате
      const latestDateArray = data
        .sort((a, b) =>
          a.created_at > b.created_at ? -1 : b.created_at > a.created_at ? 1 : 0
        )
        .filter((x) => x.created_at === data[0].created_at);

      // Ищем яндекс и гугл
      const enginesArray = [
        {
          engine: 'yandex',
          topKeywords: [],
          data: latestDateArray.find(
            (x) => x.device === 'mobile' && x.engine === 'yandex'
          ),
        },
        {
          engine: 'yandex',
          topKeywords: [],
          data: latestDateArray.find(
            (x) => x.device === 'desktop' && x.engine === 'yandex'
          ),
        },
        {
          engine: 'google',
          topKeywords: [],
          data: latestDateArray.find(
            (x) => x.device === 'mobile' && x.engine === 'google'
          ),
        },
        {
          engine: 'google',
          topKeywords: [],
          data: latestDateArray.find(
            (x) => x.device === 'desktop' && x.engine === 'google'
          ),
        },
      ];

      // Собираем ключи

      enginesArray.forEach((item) => {
        if (item && item.data) {
          Object.keys(item.data.body.host).forEach((key) => {
            item.topKeywords = item.topKeywords.concat(
              item.data.body.host[key]
            );
          });
        }
      });

      //Объединяем десктоп с мобильными устройствами
      let yandexCompetitorsWords = [];
      let googleCompetitorsWords = [];
      enginesArray.forEach((item) => {
        if (item.engine === 'yandex') {
          item.topKeywords.forEach((key) => {
            yandexCompetitorsWords.push(key);
          });
        } else if (item.engine === 'google') {
          item.topKeywords.forEach((key) => {
            googleCompetitorsWords.push(key);
          });
        }
      });

      //Считаем количество повторений
      yandexCompetitorsWords = yandexCompetitorsWords.reduce(
        (previous, current) => (
          (previous[current] = previous[current] + 1 || 1), previous
        ),
        {}
      );
      googleCompetitorsWords = googleCompetitorsWords.reduce(
        (previous, current) => (
          (previous[current] = previous[current] + 1 || 1), previous
        ),
        {}
      );

      //Создаем итоговый массив
      const resultYandexArray = [];
      const resultGoogleArray = [];
      Object.keys(yandexCompetitorsWords).forEach((key) => {
        resultYandexArray.push({
          key: key,
          value: yandexCompetitorsWords[key],
        });
      });
      Object.keys(googleCompetitorsWords).forEach((key) => {
        resultGoogleArray.push({
          key: key,
          value: googleCompetitorsWords[key],
        });
      });
      //Сортируем по убыванию
      resultYandexArray.sort((a, b) =>
        a.value > b.value ? -1 : b.value > a.value ? 1 : 0
      );
      resultGoogleArray.sort((a, b) =>
        a.value > b.value ? -1 : b.value > a.value ? 1 : 0
      );
      setItems({
        yandex: resultYandexArray,
        google: resultGoogleArray,
      });
    }
  }, [data, hostsNumber]);

  const changeHostsNumber = () => {
    setHostsNumber(inputRef.current.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <span className={styles.text}>Количество конкурентов</span>
        <input
          className={styles.input}
          min={1}
          type='number'
          defaultValue={hostsNumber}
          ref={inputRef}
        />
        <button className={styles.button} onClick={changeHostsNumber}>
          Показать
        </button>
      </div>
      <div className={styles.lists}>
        <div className={styles.list_container}>
          <p className={styles.list_heading}>Яндекс</p>
          <ul className={styles.list}>
            {items &&
              items.yandex.map(
                (item, index) =>
                  index + 1 <= hostsNumber && (
                    <li key={item.key} className={styles.list_item}>
                      <span className={styles.host}>
                        {index + 1}.&nbsp;{item.key}:
                      </span>
                      <span className={styles.value}>{item.value}</span>
                    </li>
                  )
              )}
          </ul>
        </div>
        <div className={styles.list_container}>
          <p className={styles.list_heading}>Google</p>
          <ul className={styles.list}>
            {items &&
              items.google.map(
                (item, index) =>
                  index + 1 <= hostsNumber && (
                    <li key={item.key} className={styles.list_item}>
                      <span className={styles.host}>
                        {index + 1}.&nbsp;{item.key}:
                      </span>
                      <span className={styles.value}>{item.value}</span>
                    </li>
                  )
              )}
          </ul>
        </div>
      </div>
    </div>
  );
}
