// This file handles the dynamic SVG background animation
document.addEventListener('DOMContentLoaded', function() {
    const bgContainer = document.getElementById('bgAnimation');
    
    // Create the SVG background dynamically with 100% width and height
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 800">
      <defs>
        <!-- Enhanced Gradients -->
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f2846" />
          <stop offset="50%" stop-color="#1a2c4c" />
          <stop offset="100%" stop-color="#0f1b38" />
          <animate attributeName="x1" values="0%;100%;0%" dur="40s" repeatCount="indefinite" />
          <animate attributeName="y1" values="0%;100%;0%" dur="30s" repeatCount="indefinite" />
        </linearGradient>

        <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#64ffda" stop-opacity="1" />
          <stop offset="100%" stop-color="#64ffda" stop-opacity="0.6" />
        </radialGradient>
        
        <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#64ffda" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#64ffda" stop-opacity="0" />
        </radialGradient>
        
        <!-- Enhanced Filters -->
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <filter id="powerfulGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <!-- Grid Pattern -->
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#8892b0" stroke-width="0.3" stroke-opacity="0.2">
            <animate attributeName="stroke-opacity" values="0.05;0.2;0.05" dur="10s" repeatCount="indefinite" />
          </path>
        </pattern>
      </defs>
      
      <!-- Animated Background with parallax effect -->
      <rect width="100%" height="100%" fill="url(#bgGradient)">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="10s" repeatCount="indefinite" />
      </rect>
      <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0,0;10,10;0,0" dur="60s" repeatCount="indefinite" />
      </rect>
      
      <!-- Background Particles -->
      <g id="particles">
        ${generateParticles(40)}
      </g>
      
      <!-- Animated blockchain nodes with better positioning -->
      <g id="nodes">
        ${generateNodes(15)}
      </g>
      
      <!-- Blockchain connections with animation -->
      <g id="connections">
        ${generateConnections()}
      </g>
      
      <!-- Floating ETH symbols with better animation -->
      <g id="symbols" fill="url(#nodeGradient)" filter="url(#glow)">
        ${generateEthSymbols(8)}
      </g>
      
      <!-- Animated pulse effects -->
      <g id="pulses">
        <circle cx="500" cy="300" r="15" fill="none" stroke="#64ffda" stroke-width="2" opacity="0">
          <animate attributeName="r" values="15;80" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="4s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="700" cy="450" r="12" fill="none" stroke="#64ffda" stroke-width="2" opacity="0">
          <animate attributeName="r" values="12;70" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="5s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="300" cy="500" r="18" fill="none" stroke="#64ffda" stroke-width="2" opacity="0">
          <animate attributeName="r" values="18;90" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="6s" repeatCount="indefinite" />
        </circle>
      </g>
      
      <!-- Digital Data Stream Effects -->
      <g id="dataStreams">
        ${generateDataStreams(6)}
      </g>
    </svg>
    `;
    
    // Define helper functions to generate elements
    function generateParticles(count) {
      let particles = '';
      
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 1200);
        const y = Math.floor(Math.random() * 800);
        const size = Math.random() * 2 + 0.5;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 10;
        const opacity = Math.random() * 0.4 + 0.1;
        
        particles += `
          <circle cx="${x}" cy="${y}" r="${size}" fill="#64ffda" opacity="${opacity}">
            <animate attributeName="opacity" values="${opacity};${opacity + 0.2};${opacity}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0;${Math.random() * 20 - 10},${Math.random() * 20};" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
          </circle>
        `;
      }
      
      return particles;
    }
    
    function generateNodes(count) {
      let nodes = '';
      const nodePositions = [];
      
      for (let i = 0; i < count; i++) {
        const x = 100 + Math.floor(Math.random() * 1000);
        const y = 100 + Math.floor(Math.random() * 600);
        const size = Math.random() * 8 + 4;
        
        nodePositions.push({ x, y, size });
        
        const duration = Math.random() * 3 + 3;
        const delay = Math.random() * 2;
        
        nodes += `
          <circle cx="${x}" cy="${y}" r="${size}" fill="url(#nodeGradient)" filter="url(#glow)" opacity="0.8" class="node" data-index="${i}">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
            <animate attributeName="r" values="${size};${size * 1.2};${size}" dur="${duration * 1.5}s" begin="${delay}s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values="0,0;0,${Math.random() * 10 - 5};0,0" dur="${duration * 2}s" begin="${delay}s" repeatCount="indefinite" />
          </circle>
        `;
      }
      
      window.nodePositions = nodePositions;
      return nodes;
    }
    
    function generateConnections() {
      if (!window.nodePositions || window.nodePositions.length === 0) return '';
      
      let connections = '';
      const positions = window.nodePositions;
      
      // Connect nodes that are reasonably close to each other
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const n1 = positions[i];
          const n2 = positions[j];
          
          // Calculate distance between nodes
          const dist = Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
          
          // Only connect if they're close enough but not too close
          if (dist < 250 && dist > 50) {
            const duration = Math.random() * 3 + 4;
            const delay = Math.random() * 2;
            const opacity = Math.max(0.1, 0.5 - dist / 500);
            
            connections += `
              <line x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" stroke="#64ffda" stroke-width="1" opacity="${opacity}">
                <animate attributeName="opacity" values="${opacity};${opacity + 0.2};${opacity}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
                <animate attributeName="stroke-width" values="1;1.5;1" dur="${duration * 1.5}s" begin="${delay}s" repeatCount="indefinite" />
              </line>
            `;
          }
        }
      }
      
      return connections;
    }
    
    function generateEthSymbols(count) {
      let symbols = '';
      
      for (let i = 0; i < count; i++) {
        const x = 100 + Math.floor(Math.random() * 1000);
        const y = 100 + Math.floor(Math.random() * 600);
        const size = Math.random() * 15 + 10;
        
        const duration = Math.random() * 15 + 15;
        const delay = Math.random() * 5;
        const moveHeight = Math.random() * 40 + 10;
        
        // Create a more accurate ETH symbol
        symbols += `
          <g transform="translate(${x}, ${y}) scale(${size / 100})">
            <path d="M39.964 0L40 15.81 55.997 23.265 40 31.589 39.964 48 24 24.855z" fill="#64ffda" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="translate" values="0,0;0,-${moveHeight};0,0" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
            </path>
          </g>
        `;
      }
      
      return symbols;
    }
    
    function generateDataStreams(count) {
      let streams = '';
      
      for (let i = 0; i < count; i++) {
        const startX = Math.random() * 1200;
        const startY = Math.random() * 800;
        const length = Math.random() * 150 + 50;
        const angle = Math.random() * 360;
        
        // Calculate end point based on angle and length
        const endX = startX + length * Math.cos(angle * Math.PI / 180);
        const endY = startY + length * Math.sin(angle * Math.PI / 180);
        
        const duration = Math.random() * 8 + 6;
        const delay = Math.random() * 2;
        
        streams += `
          <line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#64ffda" stroke-width="1.5" opacity="0.3" stroke-dasharray="4,4">
            <animate attributeName="stroke-dashoffset" values="0;-20" dur="${duration}s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="${duration * 1.2}s" begin="${delay}s" repeatCount="indefinite" />
          </line>
        `;
      }
      
      return streams;
    }
    
    // Add the SVG to the background container
    bgContainer.innerHTML = svgContent;
    
    // Add interactive elements
    if (window.innerWidth > 768) {
      addInteractiveElements();
    }
  });
  
  // Add mouse interaction to the background
  function addInteractiveElements() {
    const bg = document.getElementById('bgAnimation');
    
    // Add floating node that follows cursor
    const floatingNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    floatingNode.setAttribute("r", "4");
    floatingNode.setAttribute("fill", "#64ffda");
    floatingNode.setAttribute("opacity", "0.8");
    floatingNode.setAttribute("filter", "url(#glow)");
    
    // Add pulse effect around cursor
    const cursorPulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    cursorPulse.setAttribute("r", "10");
    cursorPulse.setAttribute("fill", "none");
    cursorPulse.setAttribute("stroke", "#64ffda");
    cursorPulse.setAttribute("stroke-width", "1");
    cursorPulse.setAttribute("opacity", "0.5");
    
    // Get the SVG element within the container
    const svg = bg.querySelector('svg');
    if (svg) {
      svg.addEventListener('mousemove', function(e) {
        // Get mouse position relative to SVG
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update the floating node position
        floatingNode.setAttribute("cx", x);
        floatingNode.setAttribute("cy", y);
        
        // Update the cursor pulse position
        cursorPulse.setAttribute("cx", x);
        cursorPulse.setAttribute("cy", y);
        
        // Add the elements to SVG if they're not already there
        if (!floatingNode.parentNode) {
          svg.appendChild(floatingNode);
          svg.appendChild(cursorPulse);
          
          // Add animation to cursor pulse
          const animateR = document.createElementNS("http://www.w3.org/2000/svg", "animate");
          animateR.setAttribute("attributeName", "r");
          animateR.setAttribute("values", "1;40");
          animateR.setAttribute("dur", "2s");
          animateR.setAttribute("repeatCount", "indefinite");
          
          const animateOpacity = document.createElementNS("http://www.w3.org/2000/svg", "animate");
          animateOpacity.setAttribute("attributeName", "opacity");
          animateOpacity.setAttribute("values", "0.8;0");
          animateOpacity.setAttribute("dur", "2s");
          animateOpacity.setAttribute("repeatCount", "indefinite");
          
          cursorPulse.appendChild(animateR);
          cursorPulse.appendChild(animateOpacity);
        }
        
        // Create connection lines to nearby nodes
        createDynamicConnections(svg, x, y);
      });
      
      // Remove floating elements when mouse leaves
      svg.addEventListener('mouseleave', function() {
        // Remove floating elements
        if (floatingNode.parentNode) {
          svg.removeChild(floatingNode);
          svg.removeChild(cursorPulse);
        }
        
        // Remove any dynamic connections
        const dynamicConnections = svg.querySelectorAll('.dynamic-connection');
        dynamicConnections.forEach(conn => {
          svg.removeChild(conn);
        });
      });
      
      // Add interaction with nodes on mouseover
      svg.querySelectorAll('.node').forEach(node => {
        node.addEventListener('mouseover', function() {
          this.setAttribute('filter', 'url(#powerfulGlow)');
          
          // Create a pulse around the node
          const nodePulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          const cx = this.getAttribute('cx');
          const cy = this.getAttribute('cy');
          
          nodePulse.setAttribute("cx", cx);
          nodePulse.setAttribute("cy", cy);
          nodePulse.setAttribute("r", "10");
          nodePulse.setAttribute("fill", "none");
          nodePulse.setAttribute("stroke", "#64ffda");
          nodePulse.setAttribute("stroke-width", "2");
          nodePulse.setAttribute("opacity", "0.8");
          nodePulse.classList.add('node-pulse');
          
          const animateR = document.createElementNS("http://www.w3.org/2000/svg", "animate");
          animateR.setAttribute("attributeName", "r");
          animateR.setAttribute("values", "10;50");
          animateR.setAttribute("dur", "1.5s");
          animateR.setAttribute("repeatCount", "indefinite");
          
          const animateOpacity = document.createElementNS("http://www.w3.org/2000/svg", "animate");
          animateOpacity.setAttribute("attributeName", "opacity");
          animateOpacity.setAttribute("values", "0.8;0");
          animateOpacity.setAttribute("dur", "1.5s");
          animateOpacity.setAttribute("repeatCount", "indefinite");
          
          nodePulse.appendChild(animateR);
          nodePulse.appendChild(animateOpacity);
          
          svg.appendChild(nodePulse);
        });
        
        node.addEventListener('mouseout', function() {
          this.setAttribute('filter', 'url(#glow)');
          
          // Remove node pulse
          const nodePulses = svg.querySelectorAll('.node-pulse');
          nodePulses.forEach(pulse => {
            svg.removeChild(pulse);
          });
        });
      });
    }
  }
  
  // Create dynamic connections between cursor and nearby nodes
  function createDynamicConnections(svg, mouseX, mouseY) {
    // Remove existing dynamic connections
    const existingConnections = svg.querySelectorAll('.dynamic-connection');
    existingConnections.forEach(conn => {
      svg.removeChild(conn);
    });
    
    // Find all nodes
    const nodes = svg.querySelectorAll('#nodes circle');
    
    // Create connections to nearby nodes
    nodes.forEach(node => {
      const nx = parseFloat(node.getAttribute('cx'));
      const ny = parseFloat(node.getAttribute('cy'));
      
      // Calculate distance
      const distance = Math.sqrt(Math.pow(mouseX - nx, 2) + Math.pow(mouseY - ny, 2));
      
      // Only connect to nodes within a certain range
      if (distance < 200) {
        const connection = document.createElementNS("http://www.w3.org/2000/svg", "line");
        connection.setAttribute("x1", mouseX);
        connection.setAttribute("y1", mouseY);
        connection.setAttribute("x2", nx);
        connection.setAttribute("y2", ny);
        connection.setAttribute("stroke", "#64ffda");
        connection.setAttribute("stroke-width", "1");
        connection.setAttribute("opacity", 0.4 * (1 - distance / 200)); // Fade out with distance
        connection.classList.add('dynamic-connection');
        
        // Add dashed line effect for data transfer look
        if (Math.random() > 0.7) {
          connection.setAttribute("stroke-dasharray", "4,4");
          
          // Add animation to the dashed line
          const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
          animate.setAttribute("attributeName", "stroke-dashoffset");
          animate.setAttribute("values", "0;-20");
          animate.setAttribute("dur", "2s");
          animate.setAttribute("repeatCount", "indefinite");
          
          connection.appendChild(animate);
        }
        
        svg.appendChild(connection);
      }
    });
  }