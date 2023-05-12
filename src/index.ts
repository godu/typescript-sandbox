
const start = async () => {
	const canvas = document.querySelector('canvas');

	if (canvas === null) {
		throw new Error('Canvas is null');
	}

	if (!navigator.gpu) {
		throw new Error('WebGPU not supported on this browser.');
	}

	const adapter = await navigator.gpu.requestAdapter();
	if (!adapter) {
		throw new Error('No appropriate GPUAdapter found.');
	}

	const device = await adapter.requestDevice();

	const context = canvas.getContext('webgpu');
	if (context === null) {
		throw new Error('Context is null');
	}

	const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
	context.configure({
		device,
		format: canvasFormat,
	});

	const encoder = device.createCommandEncoder();

	const pass = encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			loadOp: 'clear',
			storeOp: 'store',
		}],
	});
};

export {};
start();
