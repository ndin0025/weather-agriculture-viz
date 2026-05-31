const dataUrl = "https://raw.githubusercontent.com/ndin0025/weather-agriculture-viz/refs/heads/main/final_merged_data.csv";
const embedOptions = { actions: false, renderer: "svg" };

function fmtMoney(value) {
  return "$" + d3.format(",.0f")(value) + "M";
}

function fmtNumber(value) {
  return d3.format(",.0f")(value);
}

d3.csv(dataUrl).then(data => {
  data.forEach(d => {
    d.year = +d.Year;
    d.rain = +d.annual_avg_rainfall;
    d.temp = +d.annual_avg_temp;
    d.income = +d.overall_farm_income;
    d.ins = +d.agri_insurance_cost_aud_m;
  });

  const yearButtons = document.getElementById("yearButtons");

  const years = [...new Set(data.map(d => d.year))].sort();

  years.forEach(year => {
    const button = document.createElement("button");
    button.className = "year-btn";
    button.dataset.year = year;
    button.textContent = year;

    button.addEventListener("click", function () {
      document.querySelectorAll(".year-btn").forEach(btn =>
        btn.classList.remove("active")
      );

      this.classList.add("active");
      updateKPI(this.dataset.year);
    });

    yearButtons.appendChild(button);
  });

  function updateKPI(selectedYear) {
    const filteredData =
      selectedYear === "all"
        ? data
        : data.filter(d => d.year === +selectedYear);

    const grouped = d3.rollups(
      filteredData,
      v => ({
        rain: d3.mean(v, d => d.rain),
        temp: d3.mean(v, d => d.temp),
        income: d3.mean(v, d => d.income),
        ins: d3.mean(v, d => d.ins)
      }),
      d => d.State
    ).map(([state, values]) => ({ state, ...values }));

    const maxRain = d3.greatest(grouped, d => d.rain);
    const maxTemp = d3.greatest(grouped, d => d.temp);
    const maxIncome = d3.greatest(grouped, d => d.income);
    const maxIns = d3.greatest(grouped, d => d.ins);

    document.getElementById("rain_value").innerText =
      fmtNumber(maxRain.rain) + " mm";
    document.getElementById("rain_state").innerText = maxRain.state;

    document.getElementById("temp_value").innerText =
      maxTemp.temp.toFixed(1) + " °C";
    document.getElementById("temp_state").innerText = maxTemp.state;

    document.getElementById("income_value").innerText =
      fmtMoney(maxIncome.income);
    document.getElementById("income_state").innerText = maxIncome.state;

    document.getElementById("ins_value").innerText =
      fmtMoney(maxIns.ins);
    document.getElementById("ins_state").innerText = maxIns.state;
  }

  updateKPI("all");

  document.querySelector(".year-btn").addEventListener("click", function () {
    document.querySelectorAll(".year-btn").forEach(btn =>
      btn.classList.remove("active")
    );

    this.classList.add("active");
    updateKPI("all");
  });
});

vegaEmbed("#rainfall_map", "charts/rainfall_map.vg.json", embedOptions).catch(console.error);
vegaEmbed("#temp_map", "charts/temp_map.vg.json", embedOptions).catch(console.error);
vegaEmbed("#income_map", "charts/income_map.vg.json", embedOptions).catch(console.error);
vegaEmbed("#rainfall_month_bar", "charts/rainfall_month_bar.vg.json", embedOptions).catch(console.error);
vegaEmbed("#monthly_heatmap", "charts/monthly_heatmap.vg.json", embedOptions).catch(console.error);
vegaEmbed("#wind_rose", "charts/wind_rose.vg.json", embedOptions).catch(console.error);
vegaEmbed("#income_line", "charts/income_line.vg.json", embedOptions).catch(console.error);
vegaEmbed("#cost_breakdown", "charts/cost_breakdown.vg.json", embedOptions).catch(console.error);
vegaEmbed("#scatter", "charts/scatter.vg.json", embedOptions).catch(console.error);
vegaEmbed("#temp_cost", "charts/temp_cost_scatter.vg.json", embedOptions).catch(console.error);


