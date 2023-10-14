(() => {
  let totalCharts = TradingViewApi.chartsCount();

  for (let i = 0; i < totalCharts; i++) {
    TradingViewApi.chart(i)
      .crossHairMoved()
      .subscribe({}, (e) => {
        if (typeof e.price === 'number' && !Number.isNaN(e.price)) {
          window.postMessage({ type: 'wf__crosshair_price', price: e.price });
        }
      });
  }
})();
