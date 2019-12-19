# 下拉框城市级联

## 示例
- html
  ```html
    <!--城市资源文件-->
    <script src="../static/citiesData.js"></script>
    
    <!--下拉框-->
    <select name="province" id="province"></select>
    <select name="city" id="city"></select>
    <select name="area" id="area"></select>
  ```
-js
  ```js
    // 调用方法
    cityCascade({
      data: CITIES_DATA,
      province: { el: document.getElementById('province'), select: '110000', disabled: ['130000'] },
      city: { el: document.getElementById('city') },
      area: { el: document.getElementById('area') }
    })
  ```