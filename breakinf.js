// infOP VI, produced by alemaninc
function infAdd(x,y) {                 // Adds two infNumbers - for example, infAdd(1,0) returns 1.0414 (log(10+1)) 
    if (Math.abs(x-y)>16) {              // If the quotient of x and y is more than 1e+16, the addition is negligible
      return Math.max(x,y)
    } else {
      z = Math.min(x,y)
      return z+Math.log10(10**(x-z)+10**(y-z))
    }
  }
  function infSubtract(x,y) {            // Subtracts two infNumbers - if y is greater than x an error message is infoutput. For example, infSubtract(1,0) returns 0.9542 (log(10-1))
    if (x-y>16) {                        // If y is less than 1/1e+16 of x, the subtraction is negligible
      return x
    } else if (x==y) {                   // If x and y are equal, 1/1e+100 is infoutput instead of -Infinite.
      return -100
    } else if (y>x) {                    // If a negative value would be infoutput, 0 is infoutput instead as the library can't support negative numbers. However, the game has controls in place to make sure negative values never occur
      return 0
    } else {
      return x+Math.log10(1-10**(y-x))
    }
  }
  var notation="Mixed scientific"
  function infFormat(x,y) {
    if (isNaN(x)) return "NaN"
    if (Math.abs(x)<3) return Math.round((y ? 10**Math.max(0,Math.min(5,2-Math.floor(x))) : 1)*10**x)/(y ? 10**Math.max(0,Math.min(5,2-Math.floor(x))) : 1)
    else if ((x<-99)&&(x>-101)) return 0
    m=(x>0)?"":"1 / "
    x=Math.abs(x)
    if (notation=="Alemaninc Ordinal") {
      infoutput="α<sub>"+(Math.floor(((x<10) ? 10*x : 100*(1+Math.log(x/10)*0.2)**5)-30).toLocaleString('en-US'))+"</sub>"
      return m+infoutput
    } else if (notation=="Double Logarithm") {
      return m+"ee"+Math.log10(x).toFixed(5)
    } else if (notation=="Engineering") {
      function preE_length(z) { // funxction to calculate length of Characters in front of floating point
        z=Math.abs(z)
        return m+(10 ** (z % 3) - ((10 ** (z % 3) % 1)) % 1).toString().length
      }
      var t = Math.log10(Math.abs(x)) // t only in use for (x>1e9)
      return m+((Math.abs(x) < 1e9)
        ? (10 ** (x % 3)).toFixed((preE_length(x) == 3) ? 1 : (preE_length(x) == 2) ? 2 : 3) // dynamic float
        + "e" + (x - (x % 3)).toLocaleString("en-US")
        : "e" + (10 ** (x % 3)).toFixed((preE_length(t) == 3) ? 1 : (preE_length(t) == 2) ? 2 : 3) // dynamic float
        + "e" + (t - (t % 3)).toLocaleString("en-US"));
    } else if (notation=="Infinity") {
      infoutput=Math.log(x)/308.25471555991675
      return m+(((infoutput>1e6)?((10**(x%1)).toFixed(2)+"e"+Math.floor(x).toLocaleString("en-US")):infoutput.toFixed(6))+"∞")
    } else if (notation=="Logarithm") {
      return m+((x<1e9) ? "e"+(x.toFixed((x>100000)?0:2)).toLocaleString('en-US') : "e"+Math.floor(100*10**(x%1))/100+"e"+Math.floor(Math.log10(x)))
    } else if (notation=="Mixed scientific") {
      const endings=["K","M","B","T","Qa","Qt","Sx","Sp","Oc","No"]
      return m+((x<0?"1 / ":"")+((x<33) ? (10**(x%3)).toFixed(2)+" "+endings[Math.floor(x/3)-1]                    // 3.5 = 3.16 K
      : (x<1e9) ? (10**(x%1)).toFixed(2)+"e"+Math.floor(x).toLocaleString("en-US")                                 // 38462.25 = 1.77e38,462
      : (x<1e33) ? "e"+(10**(Math.log10(x)%3)).toFixed(2)+" "+endings[Math.floor(Math.log10(x)/3)-1]               // 1.23e21 = e1.23 Sx
      : "e"+(x/10**Math.floor(Math.log10(x))).toFixed(2)+"e"+Math.floor(Math.log10(x))))                           // 2.34e56 = e2.34e56
    } else if (notation=="Scientific") {
      return m+((x<1e9) ? (10**(x%1)).toFixed(2)+"e"+Math.floor(x).toLocaleString("en-US") : "e"+(x/10**Math.floor(Math.log10(x))).toFixed(2)+"e"+Math.floor(Math.log10(x)))
    } else if (notation=="Tetration") {
      infoutput = 0
      while ((x>0.4342944819)&&(infoutput<5)) {
        x=(Math.log(x*Math.log(10))/Math.log(10))
        infoutput++
      }
      return m+"e ⇈ "+(infoutput+(x*Math.log(10))).toFixed(6)
    } else {
      return "Notation Error!"
    }
  }
  function normFormat(x) {               // Formats a regular number the same way infNumbers would be formatted
    if (x==0) return 0
    else if ((x>=1e6)||(x<=1e-6)) return infFormat(Math.log10(x))
    else if (x>=1000) return Math.round(x).toLocaleString("en-US")
    else if (Math.abs(x)>=100) return Math.round(x)
    else {
      precision=2+Math.max(0,-Math.floor(Math.log10(x)))
      return Math.round(x*10**precision)/10**precision
    }
  }
  function twoDigits(x) {                // Formats a one-digit number as two digits. For example, twoDigits(7) returns 07. Used in timeFormat
    return (x<10) ? "0"+Math.floor(x) : Math.floor(x)
  }
  function timeFormat(x) {               // Formats an amount of seconds as a time. For example, timeFormat(73) returns 1:13 and timeFormat(90123) returns 1 day 1:02:03
    return (x<1) ? Math.floor(x*1000)+" milliseconds" : (x<10) ? Math.floor(x*1000)/1000+" seconds" : (x<60) ? Math.floor(x)+" seconds" : (x<3600) ? Math.floor(x/60)+":"+twoDigits(Math.floor(x%60)) : (x<86400) ? Math.floor(x/3600)+":"+twoDigits(Math.floor(x/60)%60)+":"+twoDigits(Math.floor(x%60)) : Math.floor(x/86400)+" days "+Math.floor(x/3600)%24+":"+twoDigits(Math.floor(x/60)%60)+":"+twoDigits(Math.floor(x%60))
  }
  
  // The following code is for Advanced infOP only.
  function normLinearSoftcap(value,start,power) {
    return (value<start) ? value : start*(1+(power+1)*(value/start-1))**(1/(power+1))
  }
  function infLinearSoftcap(value,start,power) {
    return (value<start) ? value : start+infAdd(0,Math.log10(power+1)+infSubtract(value-start,0))/(power+1)
  }
  function LogarithmicSoftcap(value,start,power) {
    return (value<start) ? value : start*(1+Math.log(value/start)*power)**(1/power)
  }
  function SuperlogSoftcap(value,start,power) {
    if (value<start) {
      return value
    }
    c=(value/start)**power
    multiplier=(c<Math.exp(1)) ? 1+Math.log(c) : (c<Math.exp(Math.exp(1))) ? 2+Math.log(Math.log(c)) : (c<Math.exp(Math.exp(Math.exp(1)))) ? 3+Math.log(Math.log(Math.log(c))) : 4+Math.log(Math.log(Math.log(Math.log(c))))
    return (multiplier=="Infinity" ? start : start*multiplier**(1/power))
  }
  function ConvergentSoftcap(value,start,end) {
    return (Math.sign(value-start)==Math.sign(start-end)) ? value : end-(end-start)/(1+(value-start)/(end-start))
  }
  function normLinearScaling(value,start,power) {
    return (value<start) ? value : start/(power+1)*(power+(value/start)**(power+1))
  }
  function infLinearScaling(value,start,power) {
    return (value<start) ? value : start-Math.log10(power+1)+infAdd(Math.log10(power),(value-start)*(power+1))
  }
  function normSemiexpScaling(value,start,power) {
    return (value<start) ? value : 10**(Math.log10(start)*(Math.log(value)/Math.log(start))**(power+1)-Math.log10(power+1))+start*(1-1/(power+1))
  }
  function infSemiexpScaling(value,start,power) {
    return (value<start) ? value : infAdd(start*(value/start)**(power+1)-Math.log10(power+1),start*(1-1/(power+1)))
  }
  function ExponentialScaling(value,start,power) {
    return (value<start) ? value : start*Math.exp(((value/start)**power-1)/power)
  }
  function SuperexpScaling(value,start,power) {
      c=(value/start)**power
      multiplier=(c<2) ? Math.exp(c-1) : (c<3) ? Math.exp(Math.exp(c-2)) : (c<4) ? Math.exp(Math.exp(Math.exp(c-3))) : Math.exp(Math.exp(Math.exp(Math.exp(c-4))))
      return (multiplier=="Infinity" ? 1.79e308 : start*multiplier**(1/power))
  }
  function divergentScaling(value,start,end) {
    return (value>=end) ? 1e300 : ((value<start) ? value : start+(end-start)*((end-start)/(end-value)-1))
  }
  function infFloor(x) {
    return (x<0)?-100:(x>16)?x:Math.log10(Math.floor(10**x))
  }
  function safeExponent(x,y) {
    return Math.sign(x)*Math.abs(x)**y
  }
  function choosei(n,k){
      var result = 1;
      for(var i=1; i <= k; i++){
          result *= (n+1-i)/i;
      }
      return result;
  }
  function normSimplex(x,y) {
    return choosei(x+y-1,y)
  }
  function infSimplex(x,y) {
    if (x<16) {
      return Math.log10(normSimplex(10**x,y))
    } else {
      infOutput=x*y
      for (i=2;i<=y;i++) infOutput-=Math.log10(i)
      return infOutput
    }
  }






  var cells = 0;
  var best_cells = 0;
  var cell_growth = 0;
  var cell_softcap = 0;
  var U1_price = Math.log10(25);
  var U1_base = Math.log10(1.2)
  var U1_eff = 0;
  var U1_lvl = 0;
  var U2_price = 0;
  var U2_base = 1;
  var U2_eff = 0;
  var U2_lvl = 0;
  var cell_soft_start = 2;
  var U3_price = 0;
  var U3_base = Math.log10(0.05)
  var U3_eff = -10;
  var U3_lvl = 0;
  var cell_boost_price = 0;
  var cell_boost_base = 20;
  var cell_boost_eff = 100;
  var cell_boosts = 0;
  var cell_upgrade_price = 0;
  var cell_upgrade_base = 0;
  var cell_upgrade_eff = 0;
  var cell_upgrades = 0;
  var best_cell_boosts = 0;
  var U4_price = 0;
  var U4_base = 0;
  var U4_eff = 0;
  var U4_lvl = 0;
  var entropy = -10;
  var entropy_gain = -10;
  var entropy_eff = 0;
  var best_entropy = -10;

  var menu = 1;
  var tickk = 0;
  var timeingame

  var a = '';
  var b = '';
  var c = '';
  var d = '';
  var e = '';
  var f = '';
  var g = '';
  var h = '';
  var i = '';
  var j = '';
  var k = '';
  var l = '';
  var mm = '';
  var n = '';
  var o = '';
  var p = '';
  var q = '';
  var r = '';
  var s = '';
  var t = '';
  var u = '';
  var v = '';
  var w = '';
  var x = '';
  var y = '';
  var z = '';
  var aa = '';
  var ab = '';
  var ac = '';
  var ad = '';
  var ae = '';
  var af = '';


  function tick()
  {
    if(cells<-1)
    {
        cells = 0
    }
    if(cells>best_cells)
    {
      best_cells = cells
    }
    if(cell_boosts>best_cell_boosts)
    {
      best_cell_boosts = cell_boosts
    }
    if(entropy>best_entropy)
    {
      best_entropy = entropy
    }
    a = infFormat(cells,true)
    cells = cells+cell_growth/100
    U1_eff = U1_lvl*U1_base
    U1_price = infLinearScaling(U1_lvl*1.6,0.9,1)+2
    if(U1_lvl>6)
    {
      U1_price = infLinearScaling(9.6,0.9,1)+2+infSemiexpScaling(U1_lvl,4,0.8)
    }
    U1_base = Math.log10(1.2)*(cell_boost_eff/100)
    if(U3_lvl>0)
    {
    U1_base = infAdd(U1_base,Math.log10(U3_lvl*0.05))
    }
    b = infFormat(cell_growth,true)
    cell_growth = U1_eff-cell_softcap+Math.log10(1.5)+cell_upgrade_eff+entropy_eff
    cell_soft_start = 2+U2_eff
    U2_eff = U2_lvl*U2_base
    U2_base = 1*(cell_boost_eff/100)
    U2_price = infLinearScaling(U2_lvl*1.23,0.9,0.8)+5
    if(U2_lvl>7)
    {
      U2_price = infLinearScaling(9.84,0.9,0.8)+2+infSemiexpScaling(U2_lvl,5,1)
    }
    U3_eff = Math.log10(U3_lvl)+U3_base
    U3_base = Math.log10(0.05*(cell_boost_eff/100))
    U3_price = infLinearScaling(U3_lvl*1.77,0.9,0.7)+8
    if(U3_lvl>4)
    {
      U3_price = infLinearScaling(8.85,0.9,0.7)+2+infSemiexpScaling(U3_lvl,3,1.5)
    }
    U4_eff = U4_lvl*U4_base+1
    U4_base = 0.1*(cell_boost_eff/100)
    U4_price = infLinearScaling(U4_lvl*1.5,0.9,1)+65.301
    if(U4_lvl>2)
    {
      U4_price = infLinearScaling(U4_lvl*1.5,0.9,1)+64.62+infSemiexpScaling(U4_lvl+1,1,0.85)
    }
    cell_boost_price = (Math.log10(4.5)+9)*(1+((cell_boosts)*1.515))
    if(cell_boosts>1)
    {
      cell_boost_price = cell_boost_price+25.56
    }
    if(cell_boosts>2)
    {
      cell_boost_price = cell_boost_price+(4*(cell_boosts-2))
    }
    cell_boost_base = 10;
    cell_boost_eff = 100+cell_boosts*cell_boost_base
    cell_upgrade_price = infSemiexpScaling((cell_upgrades+1),1,2.5)+Math.log10(3)+24
    cell_upgrade_base = Math.log10(3)
    cell_upgrade_eff = cell_upgrades*cell_upgrade_base
    if(cells>91.47)
    {
    entropy_gain = Math.log10(Math.floor(Math.pow(10,(cells-91.46)*0.05)))
    }
    else
    {
      entropy_gain = -Infinity
    }
    if(entropy>-0.01 && cells>1)
    {
    entropy_eff = (best_entropy+0.35)*(Math.log(Math.log(cells+2)))
    }
    else
    {
      entropy_eff = 0;
    }

    if(cells>cell_soft_start*25)
    {
        cell_softcap = (cells-cell_soft_start)*0.1+(cells-cell_soft_start*25)*0.3
    }
    else if(cells>cell_soft_start)
    {
        cell_softcap = (cells-cell_soft_start)*(0.1/U4_eff)

        if(cells>61)
        {
          cell_softcap = cell_softcap+(cells-61)*(0.15/U4_eff)
        }

        if(cells>105)
        {
          cell_softcap = cell_softcap+(cells-105)*(0.15/U4_eff)
        }
    }
    else if(cells<cell_soft_start)
    {
        cell_softcap = 0
    }
    c = infFormat(cell_softcap,true);
    d = infFormat(U1_price,false);
    e = infFormat(U1_base,true);
    f = infFormat(U1_eff,true);
    g - infFormat(U1_lvl,false);
    h = infFormat(U2_price,true);
    i = infFormat(U2_base,false);
    j = infFormat(U2_eff,true);
    k = infFormat(U2_lvl,true);
    l = infFormat(cell_soft_start,false);
    mm = infFormat(U3_price,true);
    n = infFormat(U3_base,true);
    o = infFormat(U3_eff,true);
    p - infFormat(U3_lvl,false);
    q = infFormat(cell_boost_price,false);
    r = cell_boost_base;
    s = cell_boost_eff;
    t = infFormat(cell_boosts,false);
    u = infFormat(cell_upgrade_price,true);
    v = infFormat(cell_upgrade_base,true);
    w = infFormat(cell_upgrade_eff,true);
    x = infFormat(cell_upgrades,false);
    y = infFormat(U4_price,true);
    z = U4_base;
    aa = U4_eff;
    ab = infFormat(U4_lvl,false);
    ac = infFormat(entropy,false);
    ad = infFormat(entropy_gain,false);
    ae = infFormat(entropy_eff,true);
    af = infFormat(best_entropy,true);

    tickk = tickk+0.01;
    timeingame = timeFormat(tickk);
}

function tabb1()
{
   menu = 1
}

function tabb2()
{
  menu = 2
}

function tabb3()
{
  menu = 3
}

function U1()
{
    if(cells>U1_price)
    {
    cells = cells-U1_price
    U1_lvl ++
    }
}

function U2()
{
    if(cells>U2_price)
    {
    cells = cells-U2_price
    U2_lvl ++
    }
}

function U3()
{
    if(cells>U3_price)
    {
    cells = cells-U3_price
    U3_lvl ++
    }
}

function U4()
{
    if(cells>U4_price)
    {
    cells = cells-U4_price
    U4_lvl ++
    }
}

function cell_boost()
{
    if(cells>cell_boost_price)
    {
    cells = 0;
    cell_growth = 0;
    cell_soft_start = 0;
    U1_lvl = 0;
    U2_lvl = 0;
    U3_lvl = 0;
    U4_lvl = 0;
    cell_boosts ++
    }
}

function cell_upgrade()
{
    if(cells>cell_upgrade_price)
    {
      cells = cells-cell_upgrade_price
      cell_upgrades ++
    }
}

function regrow()
{
    if(cells>90.47)
    {
    entropy = infAdd(entropy,entropy_gain)
    cells = 0;
    cell_growth = 0;
    cell_soft_start = 0;
    U1_lvl = 0;
    U2_lvl = 0;
    U3_lvl = 0;
    U4_lvl = 0;
    cell_upgrades = 0;
    cell_boosts = 0
    }
}

function changenot()
{
  if(notation == 'Mixed scientific')
    {
      notation = 'Scientific'
    }
    else if(notation == 'Scientific')
    {
      notation = 'Engineering'
    }
    else if(notation == 'Engineering')
    {
      notation = 'Logarithm'
    }
    else if(notation == 'Logarithm')
    {
      notation = 'Infinity'
    }
    else if(notation =='Infinity')
    {
      notation = 'Double Logarithm'
    }
    else if(notation == 'Double Logarithm')
    {
      notation = 'Tetration'
    }
    else if(notation == 'Tetration')
    {
      notation = 'Alemaninc Ordinal'
    }
    else if(notation == 'Alemaninc Ordinal')
    {
      notation = 'Mixed scientific'
    }
}



setInterval(tick,10)