-- 表结构
CREATE TABLE dynasties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_year INT,
  end_year INT
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  year INT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  dynasty_id INT,
  FOREIGN KEY (dynasty_id) REFERENCES dynasties(id)
);

-- 插入示例数据
INSERT INTO dynasties (id, name, start_year, end_year) VALUES
  (1, '夏', -2070, -1600),
  (2, '商', -1600, -1046),
  (3, '周', -1046, -256),
  (4, '秦', -221, -206),
  (5, '汉', -206, 220);

INSERT INTO events (id, year, title, summary, dynasty_id) VALUES
  (1, -500000, '北京猿人生活', '北京猿人在周口店一带生存。', NULL),
  (2, -8000, '新石器时代开始', '人类开始定居并发展农业。', NULL),
  (3, -2070, '夏朝建立', '传说禹建立夏朝。', 1),
  (4, -1600, '商朝建立', '商汤灭夏建立商朝。', 2),
  (5, -1046, '周朝建立', '周武王克商。', 3),
  (6, -221, '秦统一中国', '秦始皇统一六国。', 4),
  (7, 618, '唐朝建立', '李渊建立唐朝。', NULL),
  (8, 960, '宋朝建立', '赵匡胤建立宋朝。', NULL),
  (9, 1644, '清朝建立', '清军入关。', NULL),
  (10, 1912, '中华民国成立', '辛亥革命成功。', NULL);
