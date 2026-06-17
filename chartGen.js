import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement } from 'chart.js';
import { Canvas } from 'skia-canvas';
import fs from 'node:fs/promises';

Chart.register([
  CategoryScale,
  LineController,
  LineElement,
  LinearScale,
  PointElement
]);

const config =
{
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'red'
        }]
    }
};

const canvas = new Canvas(400, 300);
const chart = new Chart(
    canvas,
    config
);
const pngBuffer = await canvas.toBuffer('png', {matte: 'white'});
await fs.writeFile('output.png', pngBuffer);
chart.destroy();
 