import React from "react";
import "./styles.css";

class App extends React.Component {
  state = {
    showPopup: true,
    list: ["50 Coins", "100 Coins", "150 Coins", "200 Coins", "300 Coins", "50 Coins", "600 Coins"],
    radius: 100,
    rotate: 0,
    easeOut: 0,
    angle: 0,
    top: null,
    offset: null,
    net: null,
    result: null,
    spinning: false,
    spinsLeft: 5
  };

  componentDidMount() {
    this.renderWheel();
  }

  renderWheel = () => {
    const { list } = this.state;
    const numOptions = list.length;
    const arcSize = (2 * Math.PI) / numOptions;
    this.setState({ angle: arcSize });
    this.topPosition(numOptions, arcSize);

    const canvas = document.getElementById("wheel");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let angle = 0;
    for (let i = 0; i < numOptions; i++) {
      this.renderSector(i + 1, list[i], angle, arcSize, this.getColor());
      angle += arcSize;
    }
  };

  topPosition = (num, angle) => {
    let topSpot = num === 6 ? 5 : num;
    let degreesOff = num === 6 ? Math.PI / 2 - angle : Math.PI / 2;
    this.setState({
      top: topSpot - 1,
      offset: degreesOff
    });
  };

  renderSector(index, text, start, arc, color) {
    const canvas = document.getElementById("wheel");
    const ctx = canvas.getContext("2d");
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const radius = this.state.radius;
    const startAngle = start;
    const endAngle = start + arc;
    const angle = index * arc;
    const textRadius = radius + 25;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.lineWidth = radius * 2;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.save();
    ctx.translate(
      x + Math.cos(angle - arc / 2) * textRadius,
      y + Math.sin(angle - arc / 2) * textRadius
    );
    ctx.rotate(angle - arc / 2 + Math.PI / 2);
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#000";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 2;
    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
    ctx.restore();
  }

  getColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.4)`;
  }

  spin = () => {
    if (this.state.spinning || this.state.spinsLeft <= 0) return;

    const { list } = this.state;
    const segmentAngle = 360 / list.length;
    const selectedIndex = Math.floor(Math.random() * list.length);
    const angleToSegment = selectedIndex * segmentAngle + segmentAngle / 2;
    const fullRotations = Math.floor(Math.random() * 3) + 3;
    const totalRotation = fullRotations * 360 + angleToSegment;
    const finalRotation = this.state.rotate + totalRotation;

    this.setState({
      rotate: finalRotation,
      easeOut: 2,
      spinning: true
    });

    setTimeout(() => {
      this.getResult(finalRotation);
    }, 2000);
  };

  getResult = (rotation) => {
    const { angle, top, offset, list } = this.state;
    const netRotation = ((rotation % 360) * Math.PI) / 180;
    let travel = netRotation + offset;
    let count = top + 1;

    while (travel > 0) {
      travel -= angle;
      count--;
    }

    const result = count >= 0 ? count : list.length + count;

    this.setState((prev) => ({
      result: result,
      spinning: false,
      spinsLeft: prev.spinsLeft - 1
    }));
  };

  render() {
    const { showPopup, spinning, result, list, spinsLeft } = this.state;

    return (
      <div className="App">
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              {/* ❌ Close Button */}
              <button
                className="close-button"
                onClick={() => this.setState({ showPopup: false })}
              >
                ×
              </button>

              {/* 🎡 Wheel */}
              <div className="wheel-wrapper">
                <canvas
                  id="wheel"
                  width="300"
                  height="300"
                  style={{
                    transform: `rotate(${this.state.rotate}deg)`,
                    transition: `transform ${this.state.easeOut}s ease-out`,
                  }}
                />
                <span id="selector">&#9660;</span>
              </div>

              {/* 🔘 Spin Button */}
              <button
                id="spin"
                onClick={this.spin}
                disabled={spinning || spinsLeft <= 0}
                style={{ opacity: spinsLeft <= 0 ? 0.5 : 1 }}
              >
                {spinsLeft > 0 ? `SPIN (${spinsLeft} left)` : `No Spins Left`}
              </button>

              {/* 🎉 Result */}
              {result !== null && (
                <div className="result-box">
                  🎉 You Won: <strong>{list[result]}</strong>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
