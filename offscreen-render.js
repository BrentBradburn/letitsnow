AFRAME.registerComponent('offscreen-render', {

    init: function() {
        console.log('Initializing offscreen-render component');

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = 512;
        this.canvas.height = 512;

        // Setup renderer
        this.offscreenRenderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.offscreenRenderer.setSize(512, 512);
        this.offscreenRenderer.setClearColor(0x4080c0); // background color

        // Setup scene
        this.scene = new THREE.Scene();
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.camera.position.z = 3;

        // Setup scene content
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x000020,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;  // Rotate to horizontal
        ground.position.y = 0;             // At grid level
        this.scene.add(ground);

        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);

        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        this.scene.add(new THREE.DirectionalLightHelper(directionalLight, /*size*/0.2));

        for ( i=0; i<3; i++ ) {
            const colors = [0x0000ff, 0x00ff00, 0xff0000];
            const light = new THREE.PointLight(colors[i], 1, 100);
            this.scene.add(new THREE.PointLightHelper(light, /*size*/0.2));
            light.position.set(Math.cos(i * Math.PI * 2/3) * 2, 4, Math.sin(i * Math.PI * 2/3) * 2);
            this.scene.add(light);
        }

        for (i = 0; i < 3; i++) {
            // Add static cube
            const cubeGeometry = new THREE.BoxGeometry(0.8, 1, 0.8);
            const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x404080, roughness: 0.5, metalness: 0.5 });
            cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube1.position.set(+0.5 + i, 0.0, +2.5 - i);
            this.scene.add(cube1);
        }

        // Add rotating cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5, metalness: 0.5 });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.set(0, 1, 0);
        this.scene.add(this.cube);

        // Add floating spheres
        this.spheres = [];
        for (let i = 0; i < 3; i++) {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 32, 32),
                new THREE.MeshStandardMaterial({ color: 0x0088ff, roughness: 0.5, metalness: 0.5 })
            );
            sphere.position.set(
                Math.cos(i * Math.PI * 2/3) * 2,
                1.5,
                Math.sin(i * Math.PI * 2/3) * 2
            );
            this.spheres.push(sphere);
            this.scene.add(sphere);
        }

        // Add torus
        this.torus = new THREE.Mesh(
            new THREE.TorusGeometry(1, 0.2, 16, 50),
            new THREE.MeshStandardMaterial({ color: 0xff8800, roughness: 0.5, metalness: 0.5 })
        );
        this.torus.position.set(0, 2, 0);
        this.scene.add(this.torus);

        // Adjust camera
        this.camera.position.set(4, 4, 4);
        this.camera.lookAt(0, 1, 0);

        // Setup plane material with canvas texture
        const texture = new THREE.CanvasTexture(this.canvas);
        texture.needsUpdate = true;
        
        const planeMesh = this.el.getObject3D('mesh');
        planeMesh.material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        
        this.texture = texture;
    },

    // Animate and render
    tick: function(time) {

        this.cube.rotation.x = time * 0.001;
        this.cube.rotation.y = time * 0.001;
        
        this.offscreenRenderer.render(this.scene, this.camera);
        this.texture.needsUpdate = true;

    },

    remove: function() {
        console.log('Removing offscreen-render component');
        this.offscreenRenderer.dispose();
        this.texture.dispose();
    }

});
