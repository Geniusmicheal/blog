<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;

class Newsfeeds extends Controller
{
    public function index():JsonResponse{
        $searchQuery = request()->query('q');

        $newsapiUrl = 'https://newsapi.org/v2/top-headlines/sources?apiKey=60f39e11c227477aa6d6135adf9fbb56';
        $guardianUrl = 'https://content.guardianapis.com/search?api-key=83ce0761-4aed-4a1b-8515-584b93793de1';
        $nytimesUrl = 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=03AubmoGRG8lejlDV2zaCDFyuf1d13Kn';

        if($searchQuery!=null){
            $newsapiUrl =  'https://newsapi.org/v2/everything?apiKey=60f39e11c227477aa6d6135adf9fbb56&pageSize=10&q='.$searchQuery;
            $guardianUrl = 'https://content.guardianapis.com/search?api-key=83ce0761-4aed-4a1b-8515-584b93793de1&q='.$searchQuery;
            $nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=03AubmoGRG8lejlDV2zaCDFyuf1d13Kn&q='.$searchQuery;
        }

        $requests = Http::pool(fn (Pool $pool) => [
            $pool->as('Nytimes')->get($nytimesUrl),
            $pool->as('Guardian')->get($guardianUrl),
            $pool->as('Newsapi')->get($newsapiUrl),
        ]);

        if($searchQuery!=null){
            $newsapi = json_decode($requests['Newsapi'],true)['articles'];
            $nytimes = json_decode($requests['Nytimes'],true)['response']['docs'];
        }else {
            $nytimes = json_decode($requests['Nytimes'],true)['results'];
            $newsapi = json_decode($requests['Newsapi'],true)['sources'];
        }

        $guardian = json_decode($requests['Guardian'],true)['response']['results'];
        $count = count($nytimes) >= count($guardian) ? count($nytimes) : count($guardian);
        $count = $count >= count($newsapi) ? $count : count($newsapi);

        $category = ["General","Politics", "Business", "Sport", "Technology", "Arts", "Lifestyle", "Entertainment", "Health", "Science"];
        $entertainment = ["Music","Television","Films","Movies","Film","Movie","Media"];
        $data= [
            'sources' => ['Newsapi', 'Guardian','Nytimes'],
            'category' => $category,
            'results' => []
        ];


        for ($i=0; $i< $count; $i++){
            if(isset($newsapi[$i])) {
                $category_='';
                if(isset($newsapi[$i]['category']))$category_= $newsapi[$i]['category'];
                elseif (strpos(strtolower($newsapi[$i]['url']),"sports") || strpos(strtolower($newsapi[$i]['url']),"football") ) $category_ = "Sport";
                else{
                    $lenght = count($category) >= count($entertainment) ? count($category) : count($entertainment);
                    for ($e=0; $e< $lenght; $e++){
                        if(isset($category[$e]) && strpos(strtolower($newsapi[$i]['url']), strtolower($category[$e]))){
                            $category_ = $category[$e];
                            break;
                        }elseif(isset($entertainment[$e]) && strpos(strtolower($newsapi[$i]['url']), strtolower($entertainment[$e]))){
                            $category_ = $entertainment[$e]; break;
                        }

                    }
                    if(empty($category_)) $category_='General';
                }

                array_push($data['results'], [
                    'sources' => 'Newsapi',
                    'category' =>  ("Sports"=== ucfirst($category_) || "Football" === ucfirst($category_) ? "Sport" : ucfirst($category_) )         ,
                    'header' => isset($newsapi[$i]['title'])? $newsapi[$i]['title'] : $newsapi[$i]['description'],
                    'date' => isset($newsapi[$i]['publishedAt'])? strtotime($newsapi[$i]['publishedAt']):  rand(strtotime(date("Y/m/d")), time() )
                ]);
            }

            if(isset($guardian[$i])){
                $category_='';
                if(in_array(ucfirst($guardian[$i]['sectionId']), $category)) $category_ = ucfirst($guardian[$i]['sectionId']);
                elseif(in_array(ucfirst($guardian[$i]['sectionId']),$entertainment))$category_ = "Entertainment";
                elseif (in_array(ucfirst($guardian[$i]['sectionId']), ["Sports","Football","Footballs"])) $category_ = "Sport";
                else $category_=  'General';


                array_push($data['results'],[
                    'sources' => 'Guardian',
                    'category' => $category_,
                    'header' => $guardian[$i]['webTitle'],
                    'date' =>   strtotime($guardian[$i]['webPublicationDate'])
                ]);
            }

            if(isset($nytimes[$i])){
                $category_='';
                $section =isset($nytimes[$i]['section_name'])? $nytimes[$i]['section_name'] : (empty($nytimes[$i]['subsection'])? $nytimes[$i]['section'] : $nytimes[$i]['subsection']);

                if(in_array(ucfirst($section), $category)) $category_ = ucfirst($section);
                elseif(in_array(ucfirst($section),$entertainment))$category_ = "Entertainment";
                elseif (in_array(ucfirst($section), ["Sports","Football","Footballs"])) $category_ = "Sport";
                elseif (in_array(ucfirst($section),["Live","Well"]));
                else $category_=  'General';


                array_push($data['results'],[
                    'sources' => 'Nytimes',
                    'category' => $category_,
                    'header' => isset($nytimes[$i]['title']) ? $nytimes[$i]['title']:$nytimes[$i]['abstract'],
                    'date' => isset($nytimes[$i]['pub_date']) ? strtotime($nytimes[$i]['pub_date']):  strtotime($nytimes[$i]['published_date'])
                ]);
            }
        }

        return response()->json($data , 200);
    }
}
