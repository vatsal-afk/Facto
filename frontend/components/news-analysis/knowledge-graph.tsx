import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  x?: number;
  y?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  value: number;
}

interface KnowledgeGraphProps {
  nodes: Node[];
  links: Link[];
}

export function KnowledgeGraph({ nodes, links }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 300;
    const height = 200;

    svg.selectAll("*").remove();

    const nodesCopy = nodes.map(node => ({ ...node }));
    const linksCopy = links.map(link => ({ ...link }));

    const simulation = d3.forceSimulation<Node>(nodesCopy)
      .force("link", d3.forceLink<Node, Link>()
        .links(linksCopy)
        .id((d: Node) => d.id))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll<SVGLineElement, Link>("line")
      .data(linksCopy)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
      .selectAll<SVGCircleElement, Node>("circle")
      .data(nodesCopy)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d => d3.schemeCategory10[d.group]);

    node.append("title")
      .text(d => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x ?? 0)
        .attr("y1", d => (d.source as Node).y ?? 0)
        .attr("x2", d => (d.target as Node).x ?? 0)
        .attr("y2", d => (d.target as Node).y ?? 0);

      node
        .attr("cx", d => d.x ?? 0)
        .attr("cy", d => d.y ?? 0);
    });

    // Proper cleanup function type
    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return <svg ref={svgRef} width="300" height="200"></svg>;
}