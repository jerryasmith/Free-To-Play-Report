//Script built using http://vallandingham.me/bubble_charts_in_d3.html licensed under BSD
//Copyright (c) 2012-2014, Jim Vallandingham
//All rights reserved.

(function() {
  var BubbleChart, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  BubbleChart = (function() {
    function BubbleChart(data) {
      this.hide_details = __bind(this.hide_details, this);
      this.show_details = __bind(this.show_details, this);
      this.hide_genders = __bind(this.hide_genders, this);
      this.display_genders = __bind(this.display_genders, this);
      this.move_towards_gender = __bind(this.move_towards_gender, this);
      this.display_by_gender = __bind(this.display_by_gender, this);
      this.hide_age = __bind(this.hide_age, this);
      this.display_age = __bind(this.display_age, this);
      this.move_towards_age = __bind(this.move_towards_age, this);
      this.display_by_age = __bind(this.display_by_age, this);
      
      this.hide_segment = __bind(this.hide_segment, this);
      this.display_segment = __bind(this.display_segment, this);
      this.move_towards_segment = __bind(this.move_towards_segment, this);
      this.display_by_segment = __bind(this.display_by_segment, this);

      this.move_towards_center = __bind(this.move_towards_center, this);
      this.display_group_all = __bind(this.display_group_all, this);
      this.start = __bind(this.start, this);
      this.create_vis = __bind(this.create_vis, this);
      this.create_nodes = __bind(this.create_nodes, this);
      var max_amount;
      this.data = data;
      this.width = (parseInt(d3.select('body').style('width'), -0)-1);
      if( /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ) {
          this.height = 300;
        } else if(/iPad/i.test(navigator.userAgent) ){
          this.height = 650;
        } else {
          this.height = this.width*.56;
        }
      this.tooltip = CustomTooltip("gates_tooltip", 240);
      this.center = {
        x: this.width / 2,
        y: this.height / 2
      };
      this.gender_centers = {
        "Male": {
          x: this.width / 3,
          y: this.height / 2
        },
        "Female": {
          x: 2 * this.width / 3,
          y: this.height / 2
        }
      };

      this.age_centers = {
        "13-17": {
          x: this.width / 4.2,
          y: this.height / 2
        },
        "18-24": {
          x: this.width / 3.1,
          y: this.height / 2
        },
        "25-34": {
          x: this.width / 2.31,
          y: this.height / 2
        },
        "35-44": {
          x: this.width / 1.8,
          y: this.height / 2
        },
        "45-54": {
          x: this.width / 1.52,
          y: this.height / 2
        },
        "55+": {
          x: this.width / 1.33,
          y: this.height / 2
        }
      };

            this.segment_centers = {
        "Mobile Core": {
          x: this.width / 4.7,
          y: this.height / 2
        },
        "Browser Casuals": {
          x: this.width / 3.4,
          y: this.height / 2
        },
        "Digital Natives": {
          x: this.width / 2.7,
          y: this.height / 2
        },
        "Frugal Gamers": {
          x: this.width / 2.0,
          y: this.height / 2
        },
        "Core Console Gamer": {
          x: this.width / 1.65,
          y: this.height / 2
        },
        "Mobile Casuals": {
          x: this.width / 1.45,
          y: this.height / 2
        },
        "Casuals": {
          x: this.width / 1.28,
          y: this.height / 2
        }
      };

      this.layout_gravity = -0.01;
      this.damper = 0.1;
      this.vis = null;
      this.nodes = [];
      this.force = null;
      this.circles = null;
      this.fill_color = d3.scale.ordinal().domain(["Mobile Core", "Browser Casuals", "Digital Natives", "Frugal Gamers", "Core Console Gamer", "Mobile Casuals", "Casuals"]).range(["#3498db", "#34495e", "#1ccba9", "#9b59b6", "#e74c3c", "#f1c514", "#95a5a6"]);
      max_amount = d3.max(this.data, function(d) {
        return parseInt(d.score);
      });

      if( /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ) {
          this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, this.width*.08]);
        } else if(/iPad/i.test(navigator.userAgent) ){
          this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, this.width*.069]);
        } else {
          this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, this.width*.07]);
        }

      this.create_nodes();
      this.create_vis();
    }

    BubbleChart.prototype.create_nodes = function() {
      this.data.forEach((function(_this) {
        return function(d) {
          var node;
          node = {
            id: d.id,
            name: d.group,
            radius: _this.radius_scale(parseInt(d.score)),
            value: d.score,
            group: d.group,
            gender: d.gender,
            age: d.age,
            spendcat: d.spendcat,
            timecat: d.timecat,
            popcat: d.popcat,
            x: Math.random() * 900,
            y: Math.random() * 800
          };
          return _this.nodes.push(node);
        };
      })(this));
      return this.nodes.sort(function(a, b) {
        return b.value - a.value;
      });
    };

    BubbleChart.prototype.create_vis = function() {
      var that;
      this.vis = d3.select("#chart").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
      this.circles = this.vis.selectAll("circle").data(this.nodes, function(d) {
        return d.id;
      });
      that = this;
      this.circles.enter().append("circle").attr("r", 0).attr("fill", (function(_this) {
        return function(d) {
          return _this.fill_color(d.group);
        };
      })(this)).attr("stroke-width", 1).attr("stroke", (function(_this) {
        return function(d) {
          return d3.rgb(_this.fill_color(d.group)).darker();
        };
      })(this)).attr("id", function(d) {
        return "bubble_" + d.id;
      }).on("mouseover", function(d, i) {
        return that.show_details(d, i, this);
      }).on("mouseout", function(d, i) {
        return that.hide_details(d, i, this);
      });
      return this.circles.transition().duration(2000).attr("r", function(d) {
        return d.radius;
      });
    };

    BubbleChart.prototype.charge = function(d) {
      return -Math.pow(d.radius, 2.0) / 8;
    };

    BubbleChart.prototype.start = function() {
      return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
    };

    BubbleChart.prototype.display_group_all = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_center(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
        };
      })(this));
      this.force.start();
      return this.hide_genders() && this.hide_age() && this.hide_segment(); 

    };

    BubbleChart.prototype.move_towards_center = function(alpha) {
      return (function(_this) {
        return function(d) {
          d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
          return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
        };
      })(this);
    };

    BubbleChart.prototype.display_by_gender = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_gender(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
        };
      })(this));
      this.force.start();
      return this.display_genders() && this.hide_age() && this.hide_segment(); 
    };

    BubbleChart.prototype.move_towards_gender = function(alpha) {
      return (function(_this) {
        return function(d) {
          var target;
          target = _this.gender_centers[d.gender];
          d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
          return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
        };
      })(this);
    };

    BubbleChart.prototype.display_genders = function() {
      var genders, genders_data, genders_x;
      genders_x = {
        "Male": this.width / 3.8,
        "Female": this.width / 1.35,
      };
      genders_data = d3.keys(genders_x);
      genders = this.vis.selectAll(".genders").data(genders_data);
      return genders.enter().append("text").attr("class", "years").style("font-family","BebasNeue").attr("x", (function(_this) {
        return function(d) {
          return genders_x[d];
        };
      })(this)).attr("y", this.height*.8).attr("text-anchor", "middle").text(function(d) {
        return d;
      });
    };

    BubbleChart.prototype.hide_genders = function() {
      var genders;
      return genders = this.vis.selectAll(".years").remove();
    };

    BubbleChart.prototype.display_by_segment = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_segment(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
        };
      })(this));
      this.force.start();
      return this.display_segment() && this.hide_age() && this.hide_genders();
    };

    BubbleChart.prototype.move_towards_segment = function(alpha) {
      return (function(_this) {
        return function(d) {
          var target;
          target = _this.segment_centers[d.name];
          d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
          return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
        };
      })(this);
    };

    BubbleChart.prototype.display_segment = function() {
      var segment, segment_data, segment_x;
      segment_x = {
        "Mobile Core": this.width *.08,
        "Browser Casuals": this.width *.19,
        "Digital Natives": this.width *.3,
        "Frugal Gamers": this.width *.46,
        "Core Console Gamer": this.width *.65,
        "Mobile Casuals": this.width *.8,
        "Casuals": this.width *.91,
      };
      segment_data = d3.keys(segment_x);
      segment = this.vis.selectAll(".segment").data(segment_data);
      return segment.enter().append("text").attr("class", "segments").style("font-family","BebasNeue").attr("x", (function(_this) {
        return function(d) {
          return segment_x[d];
        };
      })(this)).attr("y", this.height*.8).attr("text-anchor", "middle").text(function(d) {
        return d;
      });
    };

    BubbleChart.prototype.hide_segment = function() {
      var segment;
      return segment = this.vis.selectAll(".segments").remove();
    };

    BubbleChart.prototype.display_by_age = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_age(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
        };
      })(this));
      this.force.start();
      return this.display_age() && this.hide_genders() && this.hide_segment();
    };

    BubbleChart.prototype.move_towards_age = function(alpha) {
      return (function(_this) {
        return function(d) {
          var target;
          target = _this.age_centers[d.age];
          d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
          return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
        };
      })(this);
    };

    BubbleChart.prototype.display_age = function() {
      var age, age_data, age_x;
      age_x = {
        "13-17": this.width * .09,
        "18-24": this.width * .25,
        "25-34": this.width * .48,
        "35-44": this.width * .67,
        "45-54": this.width * .81,
        "55+": this.width * .92,
      };
      age_data = d3.keys(age_x);
      age = this.vis.selectAll(".age").data(age_data);
      return age.enter().append("text").attr("class", "age").style("font-family","BebasNeue").attr("x", (function(_this) {
        return function(d) {
          return age_x[d];
        };
      })(this)).attr("y", this.height*.8).attr("text-anchor", "middle").text(function(d) {
        return d;
      });
    };

    BubbleChart.prototype.hide_age = function() {
      var age;
      return age = this.vis.selectAll(".age").remove();
    };

    BubbleChart.prototype.show_details = function(data, i, element) {
      var content;
      d3.select(element).attr("stroke", "black");

      content = "<h3> " + data.name + "<br>" + data.gender + " " + data.age + "</h3><br>";
      content += "<span class=\"name\">Population Classification:</span><span class=\"value\"> " + data.popcat + "</span><br/>";
      content += "<span class=\"name\">Spend Classification:</span><span class=\"value\"> " + data.spendcat + "</span><br/>";
      content += "<span class=\"name\">Time Classification:</span><span class=\"value\"> " + data.timecat + "</span><br><br>";
      content += "<img src='images/" + data.name + ".png'>";
      return this.tooltip.showTooltip(content, d3.event);
    };

    BubbleChart.prototype.hide_details = function(data, i, element) {
      d3.select(element).attr("stroke", (function(_this) {
        return function(d) {
          return d3.rgb(_this.fill_color(d.group)).darker();
        };
      })(this));
      return this.tooltip.hideTooltip();
    };

    return BubbleChart;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    var chart, render_vis;
    chart = null;
    render_vis = function(csv) {
      chart = new BubbleChart(csv);
      chart.start();
      return root.display_all();
    };
    root.display_all = (function(_this) {
      return function() {
        return chart.display_group_all();
      };
    })(this);
    root.display_gender = (function(_this) {
      return function() {
        return chart.display_by_gender();
      };
    })(this);
    root.display_age = (function(_this) {
      return function() {
        return chart.display_by_age();
      };
    })(this);
    root.display_segment = (function(_this) {
      return function() {
        return chart.display_by_segment();
      };
    })(this);

    root.toggle_view = (function(_this) {
      return function(view_type) {
        if (view_type === 'segment') {
          return root.display_segment();
        } else if (view_type === 'gender') {
          return root.display_gender();
        } else if (view_type === 'age') {
          return root.display_age();
        } else { return root.display_all();
        }
      };
    })(this);
    return d3.csv("data/metafocus.csv", render_vis);
  });

}).call(this);

window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


function CustomTooltip(tooltipId, width){
  var tooltipId = tooltipId;
  $("body").append("<div class='tooltip' id='"+tooltipId+"'></div>");
  
  if(width){
    $("#"+tooltipId).css("width", width);
  }
  
  hideTooltip();
  
  function showTooltip(content, event){
    $("#"+tooltipId).html(content);
    $("#"+tooltipId).show();
    
    updatePosition(event);
  }
  
  function hideTooltip(){
    $("#"+tooltipId).hide();
  }
  
  function updatePosition(event){
    var ttid = "#"+tooltipId;
    var xOffset = 20;
    var yOffset = 10;
    
     var ttw = $(ttid).width();
     var tth = $(ttid).height();
     var wscrY = $(window).scrollTop();
     var wscrX = $(window).scrollLeft();
     var curX = (document.all) ? event.clientX + wscrX : event.pageX;
     var curY = (document.all) ? event.clientY + wscrY : event.pageY;
     var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $(window).width()) ? curX - ttw - xOffset*2 : curX + xOffset;
     if (ttleft < wscrX + xOffset){
      ttleft = wscrX + xOffset;
     } 
     var tttop = ((curY - wscrY + yOffset*2 + tth) > $(window).height()) ? curY - tth - yOffset*2 : curY + yOffset;
     if (tttop < wscrY + yOffset){
      tttop = curY + yOffset;
     } 
     $(ttid).css('top', tttop + 'px').css('left', ttleft + 'px');
  }
  
  return {
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    updatePosition: updatePosition
  }
}
