// This file handles the dynamic SVG background animation with enhanced movement (optimized for performance)
document.addEventListener('DOMContentLoaded', function() {
    const bgContainer = document.getElementById('bgAnimation');
    
    // Create the SVG background dynamically with 100% width and height
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 800">
      <defs>
        <!-- Enhanced Gradients - simplified for better performance -->
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f2846">
            <animate attributeName="stop-color" values="#0f2846;#152a60;#0f2846" dur="30s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stop-color="#1a2c4c">
            <animate attributeName="stop-color" values="#1a2c4c;#252a5c;#1a2c4c" dur="30s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stop-color="#0f1b38">
            <animate attributeName="stop-color" values="#0f1b38;#15194a;#0f1b38" dur="30s" repeatCount="indefinite" />
          </stop>
          <animate attributeName="x1" values="0%;30%;0%" dur="45s" repeatCount="indefinite" />
          <animate attributeName="y1" values="0%;20%;0%" dur="40s" repeatCount="indefinite" />
        </linearGradient>
  
        <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#64ffda" stop-opacity="1" />
          <stop offset="100%" stop-color="#64ffda" stop-opacity="0.6" />
        </radialGradient>
        
        <!-- Enhanced Filters - optimized -->
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <!-- Grid Pattern with subtle wave distortion -->
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#8892b0" stroke-width="0.3" stroke-opacity="0.2">
            <animate attributeName="stroke-opacity" values="0.05;0.2;0.05" dur="10s" repeatCount="indefinite" />
          </path>
        </pattern>
        
        <!-- Simplified waves pattern for better performance -->
        <pattern id="waves" width="300" height="300" patternUnits="userSpaceOnUse">
          <path d="M 0 150 C 75 120, 150 180, 300 150" fill="none" stroke="#6c63ff" stroke-width="0.5" stroke-opacity="0.1">
            <animate attributeName="d" values="M 0 150 C 75 120, 150 180, 300 150;M 0 150 C 75 180, 150 120, 300 150;M 0 150 C 75 120, 150 180, 300 150" dur="20s" repeatCount="indefinite" />
          </path>
          <path d="M 0 100 C 75 70, 150 130, 300 100" fill="none" stroke="#6c63ff" stroke-width="0.5" stroke-opacity="0.1">
            <animate attributeName="d" values="M 0 100 C 75 70, 150 130, 300 100;M 0 100 C 75 130, 150 70, 300 100;M 0 100 C 75 70, 150 130, 300 100" dur="25s" repeatCount="indefinite" />
          </path>
        </pattern>
      </defs>
      
      <!-- Animated Background with flowing gradients -->
      <rect width="100%" height="100%" fill="url(#bgGradient)" />
      
      <!-- Moving wave patterns - simplified for better performance -->
      <rect width="100%" height="100%" fill="url(#waves)" opacity="0.3">
        <animateTransform attributeName="transform" type="translate" values="0,0;-150,-80;0,0" dur="45s" repeatCount="indefinite" />
      </rect>
      
      <!-- Animated grid with parallax - subtle movement for better performance -->
      <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3">
        <animateTransform attributeName="transform" type="translate" values="0,0;20,20;0,0" dur="60s" repeatCount="indefinite" />
      </rect>
      
      <!-- Background flowing particles - increased for visual richness -->
      <g id="particles">
        ${generateParticles(60)}
      </g>
      
      <!-- Animated data flow streams - increased for more movement -->
      <g id="dataFlows">
        ${generateDataFlows(30)}
      </g>
      
      <!-- Additional small background dots (static with opacity animation) -->
      <g id="backgroundDots">
        ${generateBackgroundDots(80)}
      </g>
      
      <!-- Animated blockchain nodes - reduced count for performance -->
      <g id="nodes">
        ${generateNodes(8)}
      </g>
      
      <!-- Blockchain connections with animated data transfer -->
      <g id="connections">
        ${generateConnections()}
      </g>
      
      <!-- Floating ETH symbols with smoother animation -->
      <g id="symbols">
        ${generateEthSymbols(3)}
      </g>
      
      <!-- Wave pulses across the network -->
      <g id="wavePulses">
        ${generateWavePulses(3)}
      </g>
      
      <!-- Additional moving path lines -->
      <g id="pathLines">
        ${generatePathLines(8)}
      </g>
    </svg>
    `;
    
    // Define helper functions to generate elements - optimized for performance
    function generateParticles(count) {
      let particles = '';
      
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 1200);
        const y = Math.floor(Math.random() * 800);
        const size = Math.random() * 1.5 + 0.5;
        // Longer durations for smoother movement, vary by particle size for natural effect
        const duration = Math.random() * 30 + (30 / size * 0.8); 
        const delay = Math.random() * 15;
        const opacity = Math.random() * 0.3 + 0.1;
        
        // More movement for visual interest but still smooth
        const dx = Math.random() * 250 - 125; 
        const dy = Math.random() * 250 - 125;
        
        // Use a mix of colors for more visual variety but staying in theme
        const colors = ["#64ffda", "#64d8ff", "#64f0ff", "#64ffe6"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particles += `
          <circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="${opacity}">
            <animate attributeName="opacity" values="${opacity};${opacity + 0.15};${opacity}" dur="${duration * 0.6}s" begin="${delay}s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" 
              values="0,0;${dx},${dy};0,0" 
              dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
          </circle>
        `;
      }
      
      return particles;
    }
    
    // Generate smaller, less resource-intensive background dots
    function generateBackgroundDots(count) {
      let dots = '';
      
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 1200);
        const y = Math.floor(Math.random() * 800);
        const size = Math.random() * 0.8 + 0.3; // Smaller dots
        const duration = Math.random() * 10 + 10; 
        const delay = Math.random() * 10;
        // Lower opacity for background effect
        const opacity = Math.random() * 0.2 + 0.05;
        
        // Very slight movement for a subtle "twinkling" effect without high resource cost
        const dx = Math.random() * 5 - 2.5;
        const dy = Math.random() * 5 - 2.5;
        
        dots += `
          <circle cx="${x}" cy="${y}" r="${size}" fill="#64ffda" opacity="${opacity}">
            <animate attributeName="opacity" values="${opacity};${opacity * 2};${opacity}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" 
              values="0,0;${dx},${dy};0,0" 
              dur="${duration * 1.5}s" begin="${delay}s" repeatCount="indefinite" />
          </circle>
        `;
      }
      
      return dots;
    }
    
    function generateDataFlows(count) {
      let flows = '';
      
      for (let i = 0; i < count; i++) {
        const x1 = Math.floor(Math.random() * 1200);
        const y1 = Math.floor(Math.random() * 800);
        
        // Create longer, more varied lines
        const length = Math.random() * 400 + 100;
        const angle = Math.random() * Math.PI * 2; // Random angle in radians
        const x2 = x1 + Math.cos(angle) * length;
        const y2 = y1 + Math.sin(angle) * length;
        
        // Varied durations for natural flowing effect
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * 15;
        const opacity = Math.random() * 0.15 + 0.05;
        const dashLength = Math.floor(Math.random() * 15) + 5;
        
        // Use a mix of colors for more visual variety but staying in theme
        const colors = ["#64ffda", "#64d8ff", "#6ca6ff", "#64ffe6"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create flowier lines with varying speeds
        const dashSpeed = Math.random() * 0.7 + 0.3; // Speed multiplier
        
        flows += `
          <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="0.8" 
                stroke-dasharray="${dashLength},${dashLength}" opacity="${opacity}">
            <animate attributeName="stroke-dashoffset" 
                    values="0;${dashLength * 2}" 
                    dur="${duration * dashSpeed}s" 
                    begin="${delay}s" 
                    repeatCount="indefinite" />
          </line>
        `;
        
        // Occasionally add a second perpendicular line for more visual complexity
        if (Math.random() > 0.7) {
          const perpAngle = angle + (Math.PI / 2); // 90 degrees to original
          const perpLength = Math.random() * 200 + 50;
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          const perpX = midX + Math.cos(perpAngle) * perpLength;
          const perpY = midY + Math.sin(perpAngle) * perpLength;
          
          flows += `
            <line x1="${midX}" y1="${midY}" x2="${perpX}" y2="${perpY}" stroke="${color}" stroke-width="0.7" 
                  stroke-dasharray="${dashLength-1},${dashLength+1}" opacity="${opacity * 0.8}">
              <animate attributeName="stroke-dashoffset" 
                      values="0;${dashLength * 2}" 
                      dur="${duration * 1.2 * dashSpeed}s" 
                      begin="${delay + 1}s" 
                      repeatCount="indefinite" />
            </line>
          `;
        }
      }
      
      return flows;
    }
    
    function generateNodes(count) {
      let nodes = '';
      const nodePositions = [];
      
      for (let i = 0; i < count; i++) {
        const x = 100 + Math.floor(Math.random() * 1000);
        const y = 100 + Math.floor(Math.random() * 600);
        const size = Math.random() * 8 + 5;
        
        nodePositions.push({ x, y, size });
        
        // Longer durations for smoother animation
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 5;
        
        // Gentler movement for better performance
        const dx = Math.random() * 40 - 20;
        const dy = Math.random() * 40 - 20;
        
        nodes += `
          <circle cx="${x}" cy="${y}" r="${size}" fill="url(#nodeGradient)" filter="url(#glow)" opacity="0.8" class="node" data-index="${i}">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
            <animate attributeName="r" values="${size};${size * 1.2};${size}" dur="${duration * 1.5}s" begin="${delay}s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" 
              values="0,0;${dx},${dy};0,0" 
              dur="${duration * 2}s" begin="${delay}s" repeatCount="indefinite" />
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
          if (dist < 350 && dist > 50) {
            // Smoother animation with longer duration
            const duration = Math.random() * 15 + 15;
            const delay = Math.random() * 5;
            const opacity = Math.max(0.1, 0.4 - dist / 700);
            
            connections += `
              <line x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" stroke="#64ffda" stroke-width="1" opacity="${opacity}" class="connection" data-source="${i}" data-target="${j}">
                <animate attributeName="opacity" values="${opacity};${opacity + 0.15};${opacity}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
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
        const x = 200 + Math.floor(Math.random() * 800);
        const y = 200 + Math.floor(Math.random() * 400);
        const size = Math.random() * 15 + 10;
        
        // Longer durations for smoother animation
        const duration = Math.random() * 40 + 40;
        const delay = Math.random() * 10;
        
        // Smoother, more gentle movement
        const dx = Math.random() * 100 - 50;
        const dy = Math.random() * 100 - 50;
        
        // Create a more accurate ETH symbol with smoother movement
        symbols += `
          <g transform="translate(${x}, ${y}) scale(${size / 100})" opacity="0.5">
            <path d="M39.964 0L40 15.81 55.997 23.265 40 31.589 39.964 48 24 24.855z" fill="#64ffda" filter="url(#glow)">
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="${duration * 0.6}s" begin="${delay}s" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="translate" 
                values="0,0;${dx},${dy};0,0" 
                dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
            </path>
          </g>
        `;
      }
      
      return symbols;
    }
    
    function generateWavePulses(count) {
      let pulses = '';
      
      for (let i = 0; i < count; i++) {
        const x = 300 + Math.floor(Math.random() * 600);
        const y = 200 + Math.floor(Math.random() * 300);
        // Longer duration for smoother animation
        const duration = Math.random() * 30 + 30;
        const delay = Math.random() * 20;
        
        // Use different colors for visual variety
        const colors = ["#64ffda", "#64d8ff", "#6ca6ff"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        pulses += `
          <circle cx="${x}" cy="${y}" r="5" fill="none" stroke="${color}" stroke-width="1" opacity="0.6">
            <animate attributeName="r" values="5;200" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
            <animate attributeName="stroke-width" values="1;0.3" dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
          </circle>
        `;
      }
      
      return pulses;
    }
    
    // Generate curved path lines that move across the screen
    function generatePathLines(count) {
      let lines = '';
      
      for (let i = 0; i < count; i++) {
        // Start and end points
        const startX = Math.random() > 0.5 ? -100 : 1300; // Start outside viewport
        const startY = Math.floor(Math.random() * 800);
        const endX = startX > 0 ? -100 : 1300; // End on opposite side
        const endY = Math.floor(Math.random() * 800);
        
        // Control points for curve
        const ctrl1X = 300 + Math.floor(Math.random() * 600);
        const ctrl1Y = Math.floor(Math.random() * 800);
        const ctrl2X = 300 + Math.floor(Math.random() * 600);
        const ctrl2Y = Math.floor(Math.random() * 800);
        
        // Animation parameters
        const duration = Math.random() * 60 + 60; // Slow movement
        const delay = Math.random() * 30;
        const dashLength = Math.floor(Math.random() * 20) + 10;
        const dashGap = Math.floor(Math.random() * 15) + 15;
        const opacity = Math.random() * 0.2 + 0.1;
        
        // Colors
        const colors = ["#64ffda", "#64d8ff", "#6ca6ff", "#64ffe6"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create a path with a cubic Bezier curve
        lines += `
          <path d="M${startX},${startY} C${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${endX},${endY}" 
                fill="none" stroke="${color}" stroke-width="0.8" 
                stroke-dasharray="${dashLength},${dashGap}" opacity="${opacity}">
            <animate attributeName="stroke-dashoffset" 
                    values="0;${dashLength + dashGap}0" 
                    dur="${duration}s" 
                    begin="${delay}s" 
                    repeatCount="indefinite" />
          </path>
        `;
      }
      
      return lines;
    }
    
    // Add the SVG to the background container
    bgContainer.innerHTML = svgContent;
    
    // Add interactive elements with optimized performance
    if (window.innerWidth > 768) {
      addInteractiveElements();
    }
  });
  
  // Add mouse interaction to the background - optimized for performance
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
      // Throttle mousemove for better performance
      let lastMove = 0;
      svg.addEventListener('mousemove', function(e) {
        const now = Date.now();
        // Limit to 30 fps for better performance
        if (now - lastMove < 33) return;
        lastMove = now;
        
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
          animateR.setAttribute("dur", "3s");
          animateR.setAttribute("repeatCount", "indefinite");
          
          const animateOpacity = document.createElementNS("http://www.w3.org/2000/svg", "animate");
          animateOpacity.setAttribute("attributeName", "opacity");
          animateOpacity.setAttribute("values", "0.8;0");
          animateOpacity.setAttribute("dur", "3s");
          animateOpacity.setAttribute("repeatCount", "indefinite");
          
          cursorPulse.appendChild(animateR);
          cursorPulse.appendChild(animateOpacity);
        }
        
        // Create connection lines to nearby nodes - throttled for performance
        createDynamicConnections(svg, x, y);
      });
      
      // Create ripple effect on click - optimized
      let isRippling = false;
      svg.addEventListener('click', function(e) {
        // Only allow one ripple at a time for better performance
        if (isRippling) return;
        isRippling = true;
        
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create ripple effect
        const ripple = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ripple.setAttribute("cx", x);
        ripple.setAttribute("cy", y);
        ripple.setAttribute("r", "5");
        ripple.setAttribute("fill", "none");
        ripple.setAttribute("stroke", "#64ffda");
        ripple.setAttribute("stroke-width", "1.5");
        ripple.setAttribute("opacity", "0.7");
        ripple.classList.add('click-ripple');
        
        // Add animations
        const animateR = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        animateR.setAttribute("attributeName", "r");
        animateR.setAttribute("values", "5;100");
        animateR.setAttribute("dur", "2s");
        animateR.setAttribute("fill", "freeze");
        
        const animateOpacity = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        animateOpacity.setAttribute("attributeName", "opacity");
        animateOpacity.setAttribute("values", "0.7;0");
        animateOpacity.setAttribute("dur", "2s");
        animateOpacity.setAttribute("fill", "freeze");
        
        ripple.appendChild(animateR);
        ripple.appendChild(animateOpacity);
        
        svg.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
          if (ripple.parentNode === svg) {
            svg.removeChild(ripple);
          }
          isRippling = false;
        }, 2000);
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
    }
  }
  
  // Create dynamic connections between cursor and nearby nodes - optimized for performance
  function createDynamicConnections(svg, mouseX, mouseY) {
    // Remove existing dynamic connections
    const existingConnections = svg.querySelectorAll('.dynamic-connection');
    existingConnections.forEach(conn => {
      if (conn.dataset.packetId) {
        const packet = svg.querySelector(`#${conn.dataset.packetId}`);
        if (packet) svg.removeChild(packet);
      }
      svg.removeChild(conn);
    });
    
    // Find all nodes
    const nodes = svg.querySelectorAll('#nodes circle');
    let connectionCount = 0;
    
    // Create connections to nearby nodes - limit to 3 for better performance
    nodes.forEach(node => {
      if (connectionCount >= 3) return;
      
      try {
        const transformStr = node.getAttribute('transform') || '';
        let transformX = 0, transformY = 0;
        
        if (transformStr) {
          const translateMatch = transformStr.match(/translate\(([^,]+),([^)]+)\)/);
          if (translateMatch) {
            transformX = parseFloat(translateMatch[1]) || 0;
            transformY = parseFloat(translateMatch[2]) || 0;
          }
        }
        
        const nx = parseFloat(node.getAttribute('cx')) + transformX;
        const ny = parseFloat(node.getAttribute('cy')) + transformY;
        
        // Calculate distance
        const distance = Math.sqrt(Math.pow(mouseX - nx, 2) + Math.pow(mouseY - ny, 2));
        
        // Only connect to nodes within a certain range
        if (distance < 200) {
          connectionCount++;
          
          const connection = document.createElementNS("http://www.w3.org/2000/svg", "line");
          connection.setAttribute("x1", mouseX);
          connection.setAttribute("y1", mouseY);
          connection.setAttribute("x2", nx);
          connection.setAttribute("y2", ny);
          connection.setAttribute("stroke", "#64ffda");
          connection.setAttribute("stroke-width", "1");
          connection.setAttribute("opacity", 0.4 * (1 - distance / 200)); // Fade out with distance
          connection.classList.add('dynamic-connection');
          
          svg.appendChild(connection);
        }
      } catch (e) {
        // Ignore any parsing errors for better performance
      }
    });
  }