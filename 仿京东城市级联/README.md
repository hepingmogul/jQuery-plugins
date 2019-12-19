# 仿京东城市级联

## 示例
- html
  ```html
  <link rel="stylesheet" href="./city-cascade.css">
  <script src="../static/citiesData.js"></script>
  <script src="./city-cascade.js"></script>

  <div id="dv" style="padding: 10px;">北京</div>
  ```
-js
  ```js
    // 调用方法
    cityCascade({
      data: CITIES_DATA,
      input: dv,
      callback: function (data) {
        console.log(data);
      }
    });
  ```