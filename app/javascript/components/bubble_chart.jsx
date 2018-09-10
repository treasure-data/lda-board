import React from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

const renderd3 = (targetNode, baseTopics, targetTopic, onSelectTopic) => {
  const svg = d3.select(targetNode);

  const topics = baseTopics.sort((a, b) => b.frequency - a.frequency);

  const offsetWidth = svg.node().parentNode.offsetWidth - 40;
  const mdswidth = offsetWidth;
  const mdsheight = offsetWidth * 0.75;

  const xrange = d3.extent(topics, d => Number(d.x));
  const xdiff = xrange[1] - xrange[0];
  const xpad = 0.3;

  const yrange = d3.extent(topics, d => Number(d.y));
  const ydiff = yrange[1] - yrange[0];
  const ypad = 0.3;

  const xScale = d3.scaleLinear()
    .range([0, mdswidth])
    .domain((xdiff > ydiff)
      ? [
        xrange[0] - xpad * xdiff,
        xrange[1] + xpad * xdiff,
      ]
      : [
        xrange[0] - 0.5 * (ydiff - xdiff) - xpad * ydiff,
        xrange[1] + 0.5 * (ydiff - xdiff) + xpad * ydiff]);

  const yScale = d3.scaleLinear()
    .range([mdsheight, 0])
    .domain((xdiff > ydiff)
      ? [
        yrange[0] - 0.5 * (xdiff - ydiff) - ypad * xdiff,
        yrange[1] + 0.5 * (xdiff - ydiff) + ypad * xdiff,
      ]
      : [
        yrange[0] - ypad * ydiff,
        yrange[1] + ypad * ydiff]);

  const rrange = d3.extent(topics, d => Number(d.frequency));
  const rdiff = rrange[1] - rrange[0];
  const rpad = 0.01;

  const rScale = d3.scaleLinear()
    .range([10, 70])
    .domain([
      rrange[0] - rpad * rdiff,
      rrange[1] + rpad * rdiff]);

  svg
    .attr('width', mdswidth)
    .attr('height', mdsheight);

  const mdsplot = svg.select('.points');

  const zoomed = () => mdsplot.attr('transform', d3.event.transform);

  svg.call(
    d3.zoom()
      .scaleExtent([0.5, 4])
      .on('zoom', zoomed),
  );

  const points = mdsplot.selectAll('points')
    .data(topics)
    .enter();

  points.selectAll('*').remove();

  points.append('circle')
    .attr('r', data => rScale(Number(data.frequency)))
    .attr('fill', data => (data.topic_id === targetTopic ? 'rgba(220, 53, 69, 0.7)' : 'rgba(0, 123, 255, 0.7)'))
    .attr('cx', data => xScale(Number(data.x)))
    .attr('cy', data => yScale(Number(data.y)))
    .attr('stroke-width', 1)
    .attr('stroke', 'rgba(0, 0, 0, 0.8)')
    .style('opacity', data => (data.visible ? 1 : 0))
    .on('click', data => onSelectTopic(data.topic_id));

  points.append('text')
    .attr('x', data => xScale(Number(data.x)))
    .attr('y', data => yScale(Number(data.y)) - rScale(data.frequency) - 3)
    .attr('stroke', 'black')
    .style('text-anchor', 'middle')
    .style('font-size', '20px')
    .style('font-weight', 100)
    .style('opacity', data => (data.visible ? 1 : 0))
    .text(d => d.topic_id);
};

class BubbleChart extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', () => {
      const { topics, onSelectTopic, targetTopic } = this.props;
      renderd3(this.node, topics, targetTopic, onSelectTopic);
    });
  }

  componentDidUpdate() {
    const { topics, onSelectTopic, targetTopic } = this.props;
    renderd3(this.node, topics, targetTopic, onSelectTopic);
  }

  render() {
    return (
      <svg ref={(node) => { this.node = node; }} className="mx-auto">
        <g className="points" />
      </svg>
    );
  }
}

BubbleChart.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.string.isRequired,
      y: PropTypes.string.isRequired,
      frequency: PropTypes.string.isRequired,
      visible: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  targetTopic: PropTypes.number.isRequired,
  onSelectTopic: PropTypes.func.isRequired,
};

export default BubbleChart;
