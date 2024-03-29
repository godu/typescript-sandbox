
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

	// Create a buffer with the vertices for a single cell.
	const vertices = new Float32Array([
		//   X,    Y
		-0.8,
		-0.8, // Triangle 1
		0.8,
		-0.8,
		0.8,
		0.8,

		-0.8,
		-0.8, // Triangle 2
		0.8,
		0.8,
		-0.8,
		0.8,
	]);
	const vertexBuffer = device.createBuffer({
		label: 'Cell vertices',
		size: vertices.byteLength,
		// eslint-disable-next-line no-bitwise
		usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(vertexBuffer, 0, vertices);

	const vertexBufferLayout: GPUVertexBufferLayout = {
		arrayStride: 8,
		attributes: [{
			format: 'float32x2',
			offset: 0,
			shaderLocation: 0, // Position. Matches @location(0) in the @vertex shader.
		}],
	};

	// Create the shader that will render the cells.
	const cellShaderModule = device.createShaderModule({
		label: 'Cell shader',
		code: `
						@vertex
						fn vertexMain(@location(0) position: vec2f) -> @builtin(position) vec4f {
							return vec4f(position, 0, 1);
						}
	
						@fragment
						fn fragmentMain() -> @location(0) vec4f {
							return vec4f(1, 0, 0, 1);
						}
					`,
	});

	// Create a pipeline that renders the cell.
	const cellPipeline = device.createRenderPipeline({
		label: 'Cell pipeline',
		layout: 'auto',
		vertex: {
			module: cellShaderModule,
			entryPoint: 'vertexMain',
			buffers: [vertexBufferLayout],
		},
		fragment: {
			module: cellShaderModule,
			entryPoint: 'fragmentMain',
			targets: [{
				format: canvasFormat,
			}],
		},
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
// eslint-disable-next-line @typescript-eslint/no-floating-promises
start();
