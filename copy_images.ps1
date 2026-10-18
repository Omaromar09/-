$base = "C:\Users\dell\Desktop\el-veranda-workspace"
$imgDir = "$base\assets\images"
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null

$extracted = "$base\extracted_media"

Copy-Item "$extracted\photo_2026-10-18_14-08-10.jpg" "$imgDir\logo.jpg" -Force
Copy-Item "$extracted\photo_2026-10-18_14-08-03.jpg" "$imgDir\coffee-cup.jpg" -Force
Copy-Item "$extracted\photo_2026-10-18_14-08-02.jpg" "$imgDir\outdoor-terrace.jpg" -Force
Copy-Item "$extracted\photo_2026-10-18_14-08-05.jpg" "$imgDir\hallway-mirror.jpg" -Force
Copy-Item "$extracted\photo_2026-10-18_14-08-04.jpg" "$imgDir\students-community.jpg" -Force
Copy-Item "$extracted\photo_2026-10-18_14-07-50.jpg" "$imgDir\bedouin-corner.jpg" -Force
Copy-Item "$extracted\photo_2026-10-18_14-07-54.jpg" "$imgDir\classic-study-room1.jpg" -Force
Copy-Item "$extracted\photo_2026-10-18_14-07-58.jpg" "$imgDir\classic-study-room2.jpg" -Force
Copy-Item "$extracted\photo_2026-10-18_14-08-00.jpg" "$imgDir\bright-hall.jpg" -Force
Copy-Item "$extracted\photo_2026-10-18_14-08-01.jpg" "$imgDir\chandelier-room.jpg" -Force
Copy-Item "$extracted\photo_2026-10-18_14-07-59.jpg" "$imgDir\art-merch-corner.jpg" -Force

Get-ChildItem $imgDir | Select-Object Name, Length
