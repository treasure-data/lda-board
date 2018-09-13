import os

class DimensionReduction(object):
  def jspca(self):
    os.system('pip install pandas')
    os.system('pip install scipy')
    os.system('pip install sklearn')
    os.system('pip install pandas-td')
    os.system('pip install pyyaml')

    from sklearn.decomposition import PCA
    import pandas as pd
    import pandas_td
    import yaml
    from scipy.spatial.distance import pdist, squareform
    from scipy.stats import entropy

    def _js(_P, _Q):
      _M = 0.5 * (_P + _Q)
      return 0.5 * (entropy(_P, _M) + entropy(_Q, _M))

    with open('config/params.yml') as f:
      params = yaml.load(f)

    apikey = os.environ.get("python_apikey")
    dbname = params['dbname']

    connection = pandas_td.connect(apikey=apikey)

    engine = pandas_td.create_engine(
      'presto:{}'.format(dbname),
      con=connection
    )

    df = pandas_td.read_td(
      'select label, lambda from pca_input order by label asc',
      engine
    )

    pca = PCA(n_components=2, random_state=0)

    dist = []
    for index, row in df.iterrows():
      dist.append([0 if v is None else v for v in row['lambda'][2:]])

    dist_matrix = squareform(pdist(dist, metric=_js))

    result_df = pd.DataFrame(
      pca.fit_transform(dist_matrix),
      columns=['x', 'y']
    )
    
    pandas_td.to_td(
      result_df,
      '{}.principal_component'.format(dbname),
      connection,
      if_exists='replace'
    )

if __name__ == '__main__':
  dr = DimensionReduction()
  dr.jspca()
