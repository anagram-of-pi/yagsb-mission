/**
 * Returns the URL for a bar chart with the given parameters
 * 
 * @param {Array} data - The data to be displayed. First value of series is the label. 
 * @param {boolean} isHorizontal - Whether the bars are horizontal or vertical
 * @param {boolean} isStacked - Whether the bars are stacked or grouped
 * @param {Number} radius - The border radius of the bars in px
 * @param {string[][]} colors - The colors to use for the bars; split into nested arrays for each series. Each subarray has a hex color
 * 
 * @returns {string} The URL to the image
 */
function createBar(data, isHorizontal, isStacked, radius, colors, animation) {
    console.log("Creating bar chart URL...");

    try {
        // Delimitate the data into `val,val,val|val,val,val...` 
        // Series are separated by `|` and values are separated by `,`
        let chartData = [];
        let chartLabels = [];
        if (data) {
            data.forEach((series) => {
                let s = Array.from(series);
                chartLabels.push(s.shift());
                chartData.push(s.join(","));
            });
            chartData = "a:" + chartData.join("|");
            chartLabels = chartLabels.join("|");
        } else {
            chartData = "";
            chartLabels = "";
        }
        
        // Decide between the four options bhs, bhg, bvs, or bvg (horizontal stacked, vertical grouped, etc.)
        let chartType = "b" + (isHorizontal?"h":"v") + (isStacked?"s":"g");

        // Same format as data
        let chartColors = [];
        if (colors) {
            colors.forEach((series) => {
                chartColors.push(series.join(","));
            });
            chartColors = chartColors.join("|");
        } else {
            chartColors = "";
        }

        let chartAnimation = "";
        if (animation && animation[2]) {
            // Format as <duration>,<easing> if true, else empty string
            chartAnimation = `&chan=${animation[1]},${animation[2]}`;
        }

        // Concatenate all parts of URL into one
        let url = `https://image-charts.com/chart?cht=${chartType}&chd=${chartData}&chl=${chartLabels}${chartAnimation}`;

        console.log(`Generated url: ${url}\n`);

        return url;

    } catch (error) {
        console.log(`\n\n-----\n\x1b[31m!! createBar failed due to ${error}.\x1b[0m\nData: ${data}\nisHorizontal: ${isHorizontal}\nisStacked: ${isStacked}\nradius: ${radius}\ncolors: ${colors}\nanimation: ${animation}\n-----\n\n`);
        console.error(error);
        
        return null;
    }
}

console.log(createBar([["a", 1, 2], ["b", 3, 4]]))