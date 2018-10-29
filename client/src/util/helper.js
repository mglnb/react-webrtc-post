/**
 * @export
 * @param {string} type ['log', 'error', 'warn']
 * @param {string} color ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'brown']
 * @param {String[]} msg
 */
export function log(msg, color = "blue") {
  let colors = {
    gray: "font-weight: bold; color: #1B2B34;",
    red: "font-weight: bold; background-color: #EC5f67; color: #FFFFFF;",
    orange: "font-weight: bold; color: #F99157;",
    yellow: "font-weight: bold; color: #FAC863;",
    green: "font-weight: bold; color: #99C794;",
    teal: "font-weight: bold; color: #5FB3B3;",
    blue: "font-weight: bold; color: #6699CC;",
    purple: "font-weight: bold; color: #C594C5;",
    brown: "font-weight: bold; color: #AB7967;"
  };
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  return {
    info: () =>
      console.log(
        `%c${date} ${time} - Log: %c %s`,
        `color: ${colors[color]}, font-size: 16px`,
        "",
        msg.toString()
      ),
    error: () =>
      console.error(
        `%c${date} ${time} - Error: %c %s`,
        `color: ${colors.red}, font-size: 16px`,
        "",
        msg.toString()
      ),
    warn: () =>
      console.log(
        `%c${date} ${time} - Warning: %c %s`,
        `color: ${colors.yellow}, font-size: 16px`,
        "",
        msg.toString()
      )
  };
}
