var result = [];
$(function(){
  
  $('form').on('submit', function(event){
    event.preventDefault();
    var form = $(this);
    var keywords = $(this[name='keywords']).val();
    var key = $(this[name='keywords']);
    var data = key.serialize();

    $('#message').toggle( "normal" );
    $('#message').toggleClass('alert-danger').toggleClass('alert-warning').text('搜尋中...');

    $.ajax({
      type: 'POST',
      url: '/search',
      data: data
      }).done( function(data, textStatus){
        form.trigger('reset');        
        result = data;

        $('#message').toggleClass('alert-warning').toggleClass('alert-success').text('搜尋完成！');
        $('#message').toggle( "slow" );
        showResult();
      });
  });

  $('#g_search').click(function() {
    $('#g_result').toggle(50);
  });
  $('#y_search').click(function() {
    $('#y_result').toggle(50);
  });
  $('#b_search').click(function() {
    $('#b_result').toggle(50);
  });

});

function showResult() {

  var content=[], title, url, des;

  content[0] = "<tbody>";
  content[1] = "<tbody>";
  content[2] = "<tbody>";

  for (var i = 0; i < result.length; i++) {
    for (var j = 0; j < result[0].length; j++) {
      title = result[i][j].title;
      url = result[i][j].url;
      des = result[i][j].description;

      content[i] = content[i] + '<tr><td><a href="' + url + '" target="_blank">' + title + '</a><br>' + des + '</td></tr>';
    }
    content[i] = content[i] + '</tbody>';
  }
  $('#g_search table').html(content[0]);
  $('#y_search table').html(content[1]);
  $('#b_search table').html(content[2]);
}