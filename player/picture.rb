require 'open-uri'
require 'kconv'
require 'mysql'
require 'cgi'
require 'fileutils'

Dir.glob("*.jpg") do |filename|
  p newname = CGI.escape(filename).gsub(/%25/,"")
  if filename != newname then
    FileUtils.cp(filename, newname)
  end
end
# connection = Mysql::new("127.0.0.1", "root", "motokokusanagi", "soccer_player")

# st = connection.prepare("select name from transfer")

# connection.query("select name from transfer").each do |name|
#   # name.gsub(/(\s)/,"_")
#   _name = name.join.gsub(/(\s)/,"_")

#   fileName = _name + ".jpg"
#   p CGI.escape(fileName)
#   dirName = "/home/masa/soccer_test/player/"
#   filePath = dirName + fileName

#   FileUtils.mv( fileName, CGI.escape(fileName) )

# end

# # for j in 0..(player.size-1)
# #   player[j].name.text
# # end

# st.close()
# connection.close()
