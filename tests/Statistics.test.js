import Statistics from '../lib/Statistics.js';

global.fetch = (url, options) => new Promise((resolve, reject) => {
  let xhr = new XMLHttpRequest();

  // 2. Configuración: solicitud GET para la URL /article/.../load
  xhr.open(options.method, url);

  // 3. Envía la solicitud a la red
  xhr.send(options.body);

  // 4. Esto se llamará después de que la respuesta se reciba
  xhr.onload = function() {
    if (xhr.status != 200) { // analiza el estado HTTP de la respuesta
      reject(xhr.status);
    } else { // muestra el resultado
      resolve(xhr.response);
    }
  };
});
const needles = [
  {
    statistic_name: 'test_id',
    element_id : "test_id",
    element_class : null,
    element_data : null,
    url_full : null,
    url_needle : null,
  },
  {
    statistic_name: 'test_class',
    element_id : null,
    element_class : '.test_class',
    element_data : null,
    url_needle : null,
    url : null,
  },
  {
    statistic_name: 'test_data',
    element_id : null,
    element_class : null,
    element_data : 'test_data="testing"',
    url_full : null,
    url_needle : null,
  },
  {
    statistic_name: 'test_url_full',
    element_id : null,
    element_class : null,
    element_data : null,
    url_full : 'https://rodolfoquendo.com',
    url_needle : null,
  },
  {
    statistic_name: 'test_url_needle',
    element_id : null,
    element_class : null,
    element_data : null,
    url_full : null,
    url_needle : 'rodolfoquendo',
  },
];
test('Statistics.no-url', async () => {
  let instance = Statistics.init(needles);
  expect(instance).toBe(false);
  expect((new Statistics()).buildData()).toBe(false);
  expect((new Statistics()).start()).toBe(false);
  const update = await (new Statistics()).update();
  expect(update).toBe(false);
});
test('Statistics.with-url.no-needles', async () => {
  document.querySelector('body').setAttribute('data-stats_update_url','https://insigniaeducation.com/');
  let instance = Statistics.init();
  expect(instance).toBe(false);
});
test('Statistics.with-url.with-needles.with-data', async () => {
  document.querySelector('body').setAttribute('data-stats_update_url','https://insigniaeducation.com/');
  document.querySelector('body').setAttribute('data-test_data','testing');
  let instance = Statistics.init(needles);
  let data = instance.buildData();
  let response = await instance.update();
  expect(response !== null).toBe(true);
  expect(response !== '').toBe(true);
  expect(data['test_data'] == 1).toBe(true);
  expect(data['test_id'] == 0).toBe(true);
  expect(data['test_class'] == 0).toBe(true);
  // this will always be true as the app url is set to the same as needles
  expect(data['test_url_full'] == 1).toBe(true);
  expect(data['test_url_needle'] == 1).toBe(true);
});
test('Statistics.with-url.with-data.with-id', async () => {
  document.querySelector('body').setAttribute('data-stats_update_url','https://insigniaeducation.com/');
  document.querySelector('body').setAttribute('data-test_data','testing');
  document.querySelector('body').innerHTML += '<div id="test_id"></div>';
  let instance = new Statistics();
  instance.setNeedles(needles);
  let data = instance.buildData();
  expect(data['test_id'] == 1).toBe(true);
  expect(data['test_class'] == 0).toBe(true);
  expect(data['test_data'] == 1).toBe(true);
  // this will always be true as the app url is set to the same as needles
  expect(data['test_url_full'] == 1).toBe(true);
  expect(data['test_url_needle'] == 1).toBe(true);


  data = instance.buildData()

  data = instance.buildData()
  expect(data['test_data'] == 1).toBe(true);

  document.querySelector('body').innerHTML += '<div class="test_class"></div>';
  data = instance.buildData()
  expect(data['test_id'] == 1).toBe(true);
  expect(data['test_class'] == 1).toBe(true);
  expect(data['test_data'] == 1).toBe(true);
  expect(data['test_url_full'] == 1).toBe(true);
  expect(data['test_url_needle'] == 1).toBe(true);

  
  instance.start();
  expect(typeof window.intervals['statistics.start'] !== typeof undefined).toBe(true);
  clearInterval(window.intervals['statistics.start']);
  window.intervals = {}
  expect(typeof window.intervals['statistics.start'] === typeof undefined).toBe(true);
  Statistics.init([
    {
      statistic_name: 'test_id',
      element_id : "test_id",
      element_class : null,
      element_data : null,
      url_full : null,
      url_needle : null,
    },
  ]);
  expect(typeof window.intervals['statistics.start'] !== typeof undefined).toBe(true);

});