(window.webpackJsonp=window.webpackJsonp||[]).push([[62],{360:function(e,n,t){"use strict";t.r(n),n.default="# Server Side Rendering\n\nNormally, Apache ECharts<sup>TM</sup> renders the chart dynamically in the browser and will re-render after user interactions. However, there are specific scenarios where we also need to render charts on the server side:\n\n- Reducing the FCP time and ensuring the chart is displayed immediately.\n- Embedding charts in the environments such as Markdown, PDF that do not support scripts.\n\nIn these scenarios, ECharts also offers a variety of server-side rendering options.\n\n## Server-Side String based SVG Rendering\n\nIf you are using 5.3.0 and newer, we strongly recommend that you use the new zero-dependency server-side string based SVG rendering solution introduced in 5.3.0.\n\n```ts\nconst echarts = require('echarts');\n\n// In SSR mode the first container parameter is not required\nconst chart = echarts.init(null, null, {\n  renderer: 'svg', // must use SVG rendering mode\n  ssr: true, // enable SSR\n  width: 400, // need to specify height and width\n  height: 300\n});\n\n// use setOption as normal\nchart.setOption({\n  //...\n});\n\n// Output a string\nconst svgStr = chart.renderToSVGString();\n```\n\nThe overall code structure is the almost same as in the browser, starting with `init` to initialise a chart example and then setting the configuration items for the chart via `setOption`. However, the parameters passed to `init` will be different from those used in the browser.\n\n- Firstly, since the SVG is rendered on the server side is string based, we don't need a container to display the rendered content, so we can pass `null` or `undefined` as the first `container` parameter in the `init`.\n- Then in the third parameter of `init` we need to tell ECharts that we need to enable server-side rendering mode by specifying `ssr: true` in the display. Then ECharts will know it needs to disable the animation loop and event modules.\n- We also have to specify the height and width of the chart, so if your chart size needs to be responsive to the container, you may need to think about whether server-side rendering is appropriate for your scenario.\n\nIn the browser ECharts automatically renders the result to the page after `setOption` and then determines at each frame if there is an animation that needs to be redrawn, but in NodeJS we don't do this after setting `ssr: true`. Instead we use `renderToSVGString` to render the current chart to an SVG string, which can then be returned to the front-end via HTTP Response or saved to a local file.\n\nResponse to the browser\n\n```ts\nres.writeHead(200, {\n  'Content-Type': 'application/xml'\n});\nres.write(chart.renderToSVGString());\nres.end();\n```\n\nOr save to a local file\n\n```ts\nfs.writeFile('bar.svg', chart.renderToSVGString(), 'utf-8');\n```\n\nHere is a complete server-side SVG rendering example in CodeSandbox.\n\n<iframe src=\"https://codesandbox.io/embed/heuristic-leftpad-oq23t?autoresize=1&codemirror=1&fontsize=12&hidenavigation=1&&theme= dark\"\n     style=\"width:100%; height:400px; border:0; border-radius: 4px; overflow:hidden;\"\n     title=\"heuristic-leftpad-oq23t\"\n     allow=\"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr- spatial-tracking\"\n     sandbox=\"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts\"\n   ></iframe>\n\n### Animations in Server-side Rendering\n\nAs you can see in the example above, even using server-side rendering, ECharts can still provide animation effects, which are achieved by embedding CSS animations in the output SVG string. There is no need for additional JavaScript to play the animation.\n\nHowever, the limitations of CSS animation prevent us from implementing more flexible animations in server-side rendering, such as bar chart racing animations, label animations, and special effects animations in the `lines` series. Animation of some of the series, such as the `pie`, have been specially optimised for server-side rendering.\n\nIf you don't want this animation, you can turn it off by setting `animation: false` when `setOption`.\n\n```ts\nsetOption({\n  animation: false\n});\n```\n\n## Server-side Canvas rendering\n\nIf you want the output to be an image rather than an SVG string, or if you're still using an older version, we'd recommend using [node-canvas](https://github.com/Automattic/node-canvas) for server-side rendering, [node-canvas](https://github.com/Automattic/node-canvas) is Canvas implementations on NodeJS that provide an interface that is almost identical to the Canvas in the browser.\n\nHere's a simple example\n\n```ts\nvar echarts = require('echarts');\nconst { createCanvas } = require('canvas');\n\n// In versions ealier than 5.3.0, you had to register the canvas factory with setCanvasCreator.\n// Not necessary since 5.3.0\necharts.setCanvasCreator(() => {\n  return createCanvas();\n});\n\nconst canvas = createCanvas(800, 600);\n// ECharts can use the Canvas instance created by node-canvas as a container directly\nconst chart = echarts.init(canvas);\n\n// setOption as normal\nchart.setOption({\n  //...\n});\n\n// Output the PNG image via Response\nres.writeHead(200, {\n  'Content-Type': 'image/png'\n});\nres.write(renderChart().toBuffer('image/png'));\nres.end();\n```\n\nHere is a complete example in CodeSandbox\n\n<iframe src=\"https://codesandbox.io/embed/apache-echarts-canvas-ssr-demo-e340rt?autoresize=1&codemirror=1&fontsize=12& hidenavigation=1&&theme=dark\"\n     style=\"width:100%; height:400px; border:0; border-radius: 4px; overflow:hidden;\"\n     title=\"heuristic-leftpad-oq23t\"\n     allow=\"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr- spatial-tracking\"\n     sandbox=\"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts\"\n   ></iframe>\n\n### Loading of images\n\n[node-canvas](https://github.com/Automattic/node-canvas) provides an `Image` implementation for image loading. If you use to images in your code, we can adapt them using the `setPlatformAPI` interface that was introduced in `5.3.0`.\n\n```ts\necharts.setPlatformAPI({\n  // Same with the old setCanvasCreator\n  createCanvas() {\n    return createCanvas();\n  },\n  loadImage(src, onload, onerror) {\n    const img = new Image();\n    // must be bound to this context.\n    img.onload = onload.bind(img);\n    img.onerror = onerror.bind(img);\n    img.src = src;\n    return img;\n  }\n});\n```\n\nIf your are using image from remote, we recommend that you prefetch the image via an http request to get `base64` before passing it in as the URL of the image, to ensure that the image is loaded when render.\n"}}]);