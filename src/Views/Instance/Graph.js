import React from "react";
import injectStyles from "react-jss";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { observer, inject } from "mobx-react";
import { ForceGraph2D } from "react-force-graph";
import { debounce } from "lodash";
import Color from "color";
import { Button, Glyphicon } from "react-bootstrap";


const styles = {
  graph: {
    width: "100%",
    height: "100%",
    borderRadius: "4px",
    overflow:"hidden",
    zIndex: "2",
    position:"relative"
  },
  slider: {
    width: "5%",
    height: "20%",
    position: "absolute",
    bottom: "10px",
    right: "0px"
  },
  capture:{
    position:"absolute",
    top:"20px",
    left:"20px"
  },
  settings:{
    position:"absolute",
    top:"20px",
    right:"20px"
  },
  edit:{
    position:"absolute",
    top:"20px",
    right:"74px"
  }
};


@injectStyles(styles)
@inject("instanceStore", "graphStore")
@observer
export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.props.graphStore.fetchGraph(props.instanceStore.mainInstanceId);
    this.state = {
      graphWidth:0,
      graphHeight:0
    };
  }

  componentDidMount(){
    this.resizeDebounceFn = debounce(this.resizeWrapper, 250);
    window.addEventListener("resize", this.resizeDebounceFn);
    this.resizeWrapper();
  }

  componentWillUnmount(){
    window.removeEventListener("resize", this.resizeDebounceFn);
  }

  resizeWrapper = () => {
    this.setState({
      graphWidth: this.graphWrapper.offsetWidth,
      graphHeight: this.graphWrapper.offsetHeight
    });
  }

  changeValue(e) {
    this.props.graphStore.setStep(e);
    this.props.graphStore.fetchGraph(this.props.instanceStore.mainInstanceId);
  }

  handleNavigationClick(index){
    this.props.graphStore.handleNavigationClick(index);
  }

  handleNodeClick = (node) => {
    if(node.isGroup){
      this.props.graphStore.explodeNode(node);
    } else {
      this.props.graphStore.historyPush(node);
    }
  }

  handleCapture = (e) => {
    e.target.href = this.graphWrapper.querySelector("canvas").toDataURL("image/png");
    e.target.download = "test.png";
  }

  handleToggleSettings = () => {
    this.props.graphStore.toggleSettingsPanel();
  }

  handleToggleEdit = () => {
    this.props.graphStore.toggleEditModal();
  }

  handleNodeHover = (node) => {
    this.props.graphStore.hlNode(node);
  }

  _wrapText(context, text, x, y, maxWidth, lineHeight, node) {
    if(node.labelLines === undefined){
      let words = text.split(/( |_|-|\.)/gi);
      let line = "";
      let lines = [];

      for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n];
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n];
        }  else {
          line = testLine;
        }
      }
      lines.push(line);

      node.labelLines = lines;
    }

    y = y-(lineHeight*(node.labelLines.length-2)/2);
    node.labelLines.forEach(line => {
      context.fillText(line, x, y);
      y+=lineHeight;
    });
  }

  _paintNode = (node, ctx, scale) => {
    let dataType = node.original_dataType || node.dataType;

    ctx.beginPath();
    if(node.isGroup){
      ctx.rect(node.x-6, node.y-6, 12, 12);
    } else {
      ctx.arc(node.x, node.y, 6, 0, 2*Math.PI);
    }

    if(this.props.graphStore.highlightedNode){
      if(node !== this.props.graphStore.highlightedNode && this.props.graphStore.connectedNodes.indexOf(node) === -1){
        ctx.globalAlpha = 0.1;
      }
    }

    ctx.strokeStyle = new Color(this.props.graphStore.colorScheme[dataType]).darken(0.25).hex();
    ctx.fillStyle = this.props.graphStore.colorScheme[dataType];

    ctx.stroke();
    ctx.fill();
    if(scale > 3){
      ctx.beginPath();
      ctx.font = "1.2px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";

      let label = node.title.split?node.title:"";
      if(!node.isGroup){
        label = `(${node.dataType}) ${label}`;
      }

      this._wrapText(ctx, label, node.x, node.y, 10, 1.3, node);
    }

    ctx.globalAlpha = 1;
  };

  linkColor = (link) => {
    if(this.props.graphStore.highlightedNode){
      if(this.props.graphStore.connectedLinks.indexOf(link) === -1){
        return new Color("#ccc").alpha(0.1).rgb();
      } else if(link.target === this.props.graphStore.highlightedNode){
        return new Color("#f39c12").alpha(1).rgb();
      } else if(link.source === this.props.graphStore.highlightedNode){
        return new Color("#1abc9c").alpha(1).rgb();
      }
    } else {
      return new Color("#ccc").alpha(1).rgb();
    }
  }

  linkWidth = (link) => {
    if(this.props.graphStore.highlightedNode){
      if(this.props.graphStore.connectedLinks.indexOf(link) === -1){
        return 1;
      } else {
        return 2;
      }
    } else {
      return 1;
    }
  }

  render() {
    const { classes, graphStore } = this.props;

    let data = graphStore.graphData;

    return (
      <div className={classes.graph} ref={ref => this.graphWrapper = ref}>
        {data !== null &&
        <ForceGraph2D
          ref={ref => this.graphRef = ref}
          width={this.state.graphWidth}
          height={this.state.graphHeight}
          graphData={data}
          nodeAutoColorBy={d => d.dataType}
          nodeLabel={node => node.dataType}
          nodeCanvasObject={this._paintNode}
          onNodeClick={this.handleNodeClick}
          onNodeHover={this.handleNodeHover}
          cooldownTime={4000}
          linkColor={this.linkColor}
          linkWidth={this.linkWidth}
          nodeRelSize={7}
          linkDirectionalArrowLength={3}
        />
        }
        <a className={`${classes.capture} btn btn-primary`} onClick={this.handleCapture}><Glyphicon glyph={"camera"}/></a>
        <Button className={`${classes.settings} btn btn-primary`} onClick={this.handleToggleSettings}><Glyphicon glyph={"cog"}/></Button>
        <Button className={`${classes.edit} btn btn-primary`} onClick={this.handleToggleEdit}><Glyphicon glyph={"edit"}/>&nbsp;Edit this instance</Button>
        <Slider className={classes.slider} vertical min={1} step={1} max={5} onAfterChange={this.changeValue.bind(this)} defaultValue={2} />
      </div>
    );
  }
}